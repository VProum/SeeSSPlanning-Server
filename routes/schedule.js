const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const axios = require("axios");
const dayjs = require("dayjs");
const User = require("../models/User");
const weekday = require('dayjs/plugin/weekday');
const uploader = require("../config/cloudinary");


router.post("/schedule/create", uploader.single("image"), async (req, res, next) => {
  const newSchedule = req.body;
  let newObjSchedule = {};
  let hourDAy = dayjs(req.body.hour_day).format("HH:mm");

  newObjSchedule = { ...req.body, hour_day: hourDAy };
  newObjSchedule.streamer_id = [];
  newObjSchedule.streamer_id.push(req.session.currentUser.id);
  newObjSchedule.streamer_name = [];
  newObjSchedule.streamer_name.push(req.session.currentUser.display_name);

  try {

    let planningImg = "";


    if(req.file){
      planningImg = req.file.path;
    }

    let dBRes = await Schedule.create(newObjSchedule);

    let dbResUsr = await User.findOneAndUpdate({
      twitch_id: {$eq: req.session.currentUser.id}}, 
      {$push : {planningList: dBRes._id},
      planning_image : planningImg,
    });
    res.status(201).json(dBRes);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


router.get("/schedule/get", async (req,res, next) => {

  // Récupère les jours de la semaine actuel
const current_millis = dayjs().valueOf()
const add_day = (count, millis) => dayjs(millis).add(count, 'day').valueOf()

// ===== the actual "week starts on" stuff =====
const start_of_week = (millis, week_starts_on) => {
  if (week_starts_on === 'sunday') {
    return dayjs(millis).startOf('week').valueOf()
  } else if (week_starts_on === 'monday') {
    return add_day(1, dayjs(millis).subtract(1, 'day').startOf('week').valueOf())
  }
}

const end_of_week = (millis, week_starts_on) => {
  if (week_starts_on === 'sunday') {
    return dayjs(millis).endOf('week').valueOf()
  } else if (week_starts_on === 'monday') {
    return add_day(1, dayjs(millis).subtract(1, 'day').endOf('week').valueOf())
  }
}

//console.log(`week starts on sunday: ${dayjs(start_of_week(current_millis, 'sunday')).$d}`)
//console.log(`week starts on monday: ${dayjs(start_of_week(current_millis, 'monday')).$d}`)
let startWeek = dayjs(start_of_week(current_millis, 'monday')).$d;

//console.log(`week ends on sunday: ${dayjs(end_of_week(current_millis, 'sunday')).$d}`)
//console.log(`week ends on monday: ${dayjs(end_of_week(current_millis, 'monday')).$d}`)
let endWeek = dayjs(end_of_week(current_millis, 'monday')).$d;

try {

  
  let dbRes = await Schedule.find({
    $and: [
      {streamer_id : {$eq: req.session.currentUser.id}},
    //  {hour_day : {$gte: startWeek}},
      // {hour_day : {$lte: endWeek}},
    ],
  });
  res.status(200).json(dbRes);

} catch (error) {
    console.log(error);
}

})


router.delete("/schedule/delete/:id", async (req, res, next) =>{
  try {
    const dbResult = await Schedule.findByIdAndDelete({
      _id : req.params.id
    });


    const dbResDelete = await User.findOneAndUpdate({
      $and: [
        {twitch_id:  {$eq: req.session.currentUser.id}},
        {planningList: {$in: req.params.id}}
      ],
    }, { $pull: { planningList: req.params.id } });

    console.log(dbResDelete); 

    
    const dbRes = await Schedule.find( {streamer_id : req.session.currentUser.id});
    res.status(200).json(dbRes);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
