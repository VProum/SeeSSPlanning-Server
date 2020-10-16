const express = require("express");
const { requestNewAccessToken } = require("passport-oauth2-refresh");
const router = express.Router();
const User = require("../models/User");

router.get("/user/streamer", async function(req, res, next) {
    try {
        const dbResult = await User.find({ isStreamer: { $eq: true } })
        res.status(200).json(dbResult)
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get("/user/follow", async function(req, res, next) {
    try {
        console.log(req.session.currentUser)
        const dbResult = await User.find({ twitch_id: { $eq: req.session.currentUser.id } }).populate("streamer_list");
        console.log(dbResult[0].streamer_list)
        res.status(200).json(dbResult[0].streamer_list)
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get("/user/streamer/:id", async function(req, res, next) {
    try {
        const dbResult = await User.find({ twitch_id: { $eq: req.params.id } });
        res.status(200).json(dbResult)
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post("/user/streamer/:id", async function(req, res, next) {
    try {
        console.log("totot")
        const dbResult = await User.findOneAndUpdate({ twitch_id: { $eq: req.session.currentUser.id } }, { $push: { streamer_list: req.params.id } }, { new: true })
        res.status(200).json(dbResult)
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;