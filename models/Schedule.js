const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  weekday: {
    type: String,
    enum: ["Monday", "Tuesday", "Wenesday", 
            "Thursday", "Friday", "Saturday", "Sunday"], 
  },
  hour_day: Date,
  duration: Number,
  avatar: String,
  streamer_id: [{ type: Schema.Types.ObjectId, ref: "User" }],
  game_info: [String],
  titre, String,
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;