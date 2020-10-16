const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const axios = require("axios");
const dayjs = require("dayjs");
const User = require("../models/User");

router.post("/schedule/create", async (req, res, next) => {
  const newSchedule = req.body;
  let newObjSchedule = {};
  let hourDAy = dayjs(req.body.hour_day).format("HH:mm");

  newObjSchedule = { ...req.body, hour_day: hourDAy };
  newObjSchedule.streamer_id = [];
  newObjSchedule.streamer_id.push(req.session.currentUser.id);

  try {
    let dBRes = await Schedule.create(newObjSchedule);

    let dbResUsr = await User.findOneAndUpdate({twitch_id: {$eq: req.session.currentUser.id}}, 
                            {$push : {planningList: dBRes._id}} );


    res.status(201).json(dBRes);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
