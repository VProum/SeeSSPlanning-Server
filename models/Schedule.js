const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  weekday: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", 
            "Thursday", "Friday", "Saturday", "Sunday"], 
  },
  hour_day: { type:  String},
  duration: Number,
  avatar: Date,
  streamer_id: [Number ],
  streamer_name: [String],
  game_info: [String],
  titre: String,
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;