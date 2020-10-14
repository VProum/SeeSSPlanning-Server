const express = require("express");
const router = express.Router();
const axios = require("axios");
//Twitch authent
var passport = require("passport");
const refresh = require("passport-oauth2-refresh");
var twitchStrategy = require("passport-twitch").Strategy;

var TwitchStrategy = new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/twitch/callback",
    scope: ["user:read:email"]
}, function(accesstoken, refreshToken, profile, done) {
    console.log(profile);
    return done(null, profile);
});

passport.use(TwitchStrategy);
refresh.use(TwitchStrategy);

router.get("/", function(req, res, next) {
    res.json("index");
});

router.get("/toto", function(req, res, next) {
    res.json("toto is my friend");
});




router.get("/test/twitch", passport.authenticate('twitch'), (req, res, next) => {
    console.log(req);
    console.log(res);
});

/*router.get('/auth/twitch/callback', (req, res) => {
  req.session.user = req.user;
  console.log(">>>>>>>",window.location.hash, "Hash <<<<<<<<<<<<");
  console.log(">>>>>>>",req.state, "state <<<<<<<<<<<<");

  res.json("YATA");
  
});*/

router.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});



module.exports = router;