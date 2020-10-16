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
        console.log(req.session.currentUser.id)
        const dbResult = await User.find({ twitch_id: { $eq: req.session.currentUser.id } });
        res.status(200).json(dbResult)
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

module.exports = router;