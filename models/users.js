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

const buildQuery = (req, res, next) => {
  const { from, to, limit } = req.query;
  const userId = req.params._id;

  // handle limits
  const exerciseLogs = limit ? { $slice: ["$exerciseLogs", Number(limit)] } : 1;
  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        exerciseLogs,
      },
    },
  ];

  // handle filter exercise logs by fromDate and/or toDate
  if (from || to) {
    pipeline[0] = {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
        "exerciseLogs.date": { $gte: new Date(from), $lte: new Date(to) },
      },
    };
  }

  res.query = User.aggregate(pipeline);
  next();
};

exports.buildQuery = buildQuery;
exports.User = User;
