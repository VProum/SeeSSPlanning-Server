const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");

router.get("/twitch/callback", async function(req, res, next) {
    try {
        const apiResult = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=http://localhost:8080/auth/twitch/callback`)


        let headers = {
            "Authorization": `Bearer ${apiResult.data.access_token}`,
            "Client-Id": process.env.TWITCH_CLIENT_ID
        }

        const getUserID = await axios.get(`https://api.twitch.tv/helix/users`, { headers })
            // a ajouter dans notre DB ET dans notre session
        req.session.currentUser = getUserID.data.data[0];
        //console.log(req.session);

        //equivaut a req.session.currentuser
        //mettre api result dans session
        req.session.currentUser.twitchToken = apiResult.data;
        req.session.currentUser.twitchToken.timestamp = Date.now();
        //console.log(apiResult.data);

        let { id, email, profile_image_url, display_name, broadcaster_type } = getUserID.data.data[0];

        let createdUser = {
            twitch_id: id,
            email: email,
            avatar: profile_image_url,
            nickname: display_name,
            isStreamer: broadcaster_type ? true : false
        }

        const findMyUser = await User.find({ twitch_id: { $eq: id } });


        if (findMyUser.length === 0) {
            const dbResult = await User.create(createdUser);
            res.status(200).json(dbResult);

        }

        res.redirect(process.env.FRONTEND_URL);

    } catch (error) {
        console.log(error);
        next(error);
    }
});


router.get("/isLoggedIn", (req, res, next) => {
    if (!req.session.currentUser)
        return res.status(401).json({ message: "Unauthorized" });

    const id = req.session.currentUser.id;
    User.find({ twitch_id: { $eq: id } })
        .then((userDocument) => {
            console.log(userDocument)
            res.status(200).json(userDocument);
        })
        .catch(next);
});

router.get("/logout", async(req, res, next) => {
    if (req.session.currentUser) {
        await axios.post(`https://id.twitch.tv/oauth2/revoke?client_id=${process.env.TWITCH_CLIENT_ID}&token=${req.session.currentUser.twitchToken.access_token}`);

        req.session.destroy(function(error) {
            if (error) next(error);
            else {
                res.status(200).json({ message: "Succesfully disconnected." });
            }
        });
    }
});

module.exports = router;