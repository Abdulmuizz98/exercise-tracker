require("dotenv").config();
require("./connection.js");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { User } = require("./models/users.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  try {
    const username = req.body.username;
    const doc = await new User({ username }).save();

    res.json({ username: doc.username, _id: doc._id });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  console.log("body: ", "/n", req.body);
  const userId = req.body[":_id"];
  const newExerciseLog = {
    description: req.body.description,
    duration: req.body.duration,
  };
  if (req.body.date) newExerciseLog.date = req.body.date;

  try {
    console.log("newExerciseLog: ", newExerciseLog);

    const doc = await User.findByIdAndUpdate(
      userId,
      { $push: { exerciseLogs: newExerciseLog } },
      { new: true } // To return the updated user document
    );

    console.log("doc: ", doc);
    const { username, _id } = doc;
    const { description, duration, date } =
      doc.exerciseLogs[doc.exerciseLogs.length - 1];

    res.json({
      username,
      description,
      duration,
      date: date.toDateString(),
      _id,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

const buildQuery = (req, res, next) => {
  const { from, to, limit } = req.query;
  const userId = req.params._id;
  // const options = { from, to, limit };
  const logQuery = 1;

  if (from || to) logQuery = { $elemMatch: { date: {} } };
  if (from) logQuery["$elemMatch"].date["$gte"] = from;
  if (to) logQuery["$elemMatch"].date["$lt"] = to;

  let mongooseQuery = User.findById(userId).select({
    username: 1,
    exerciseLogs: logQuery,
  });

  if (limit) {
    mongooseQuery = mongooseQuery.limit(limit);
  }
  res.query = mongooseQuery;
  next();
};

app.get("/api/users/:_id/logs", buildQuery, async (req, res) => {
  try {
    const doc = await res.query.exec();

    // console.log("doc: ", doc);
    const { username, _id, exerciseLogs: rawLog } = doc;
    // console.log(rawLog);
    const log = rawLog.map((el) => ({
      description: el.description,
      duration: el.duration,
      date: el.date.toDateString(),
    }));
    res.json({ username, count: log.length, _id, log });
  } catch (err) {
    res.json({ error: err.message });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
