const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickname: String,
    avatar: String,
    streamer_list: [{ type: Schema.Types.ObjectId, ref: "User" }],
    twitch_id: { type: String, required: true, unique: true },

    isStreamer: Boolean,
    moderator: [{ type: Schema.Types.ObjectId, ref: "User" }],
    socialNetwork: [String],
    planningList: [{ type: Schema.Types.ObjectId, ref: "Schedule" }],
    planning_image: String,
    description: String,
    nb_followers: Number,
    streamer_type: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;