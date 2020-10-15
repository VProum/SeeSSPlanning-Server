const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickname: String,
    email: { type: String },
    avatar: String,
    streamer_list: [{ type: Schema.Types.ObjectId, ref: "User" }],
    twitch_id: String,

    isStreamer: Boolean,
    moderator: [{ type: Schema.Types.ObjectId, ref: "User" }],
    socialNetwork: [String],
    planningList: [{ type: Schema.Types.ObjectId, ref: "Schedule" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;