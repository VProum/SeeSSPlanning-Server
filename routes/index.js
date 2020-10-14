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
    res.json("toto");
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

router.get("/auth/twitch/callback", async function(req, res, next) {
    try {
        console.log(req.query.code);
        const apiResult = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=http://localhost:8080/auth/twitch/callback`)


        req.session.twitchInfo = apiResult.data;

        //mettre api result dans session
        let headers = {
            "Authorization": `Bearer ${apiResult.data.access_token}`,
            "Client-Id": process.env.TWITCH_CLIENT_ID
        }


        const getUserID = await axios.get(`https://api.twitch.tv/helix/users`, { headers })

        res.json(getUserID.data);
    } catch (error) {
        console.log(error);
        next(error);
    }
});



module.exports = router;