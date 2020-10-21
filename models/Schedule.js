const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  weekday: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", 
            "Thursday", "Friday", "Saturday", "Sunday"], 
  },
  hour_day: { type:  String},
  calcDuration: { type:  String},
  duration: Number,
  avatar: String,
  streamer_id: [Number ],
  streamer_name: [String],

  game_info: [String],
  titre: String,
},
{
  toObject: {virtuals:true},
}
);

scheduleSchema.virtual("streamerid", {
  ref: 'User',
  localField: 'streamer_id',
  foreignField: 'twitch_id',
  justOne: true // for many-to-1 relationships
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
