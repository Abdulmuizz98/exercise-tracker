const mongoose = require("mongoose");

const exerciseLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  exerciseLogs: [exerciseLogSchema],
});

const User = mongoose.model("User", userSchema);

exports.User = User;
