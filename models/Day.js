const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DaySchema = new Schema({
  day: {
    type: Date,
  },
  workouts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Workout"
    }
  ]
});

const Day = mongoose.model("Day", DaySchema);

module.exports = Day;
