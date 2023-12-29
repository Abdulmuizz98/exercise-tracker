require("dotenv").config();
require("./connection.js");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { User, buildQuery } = require("./models/users.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app
  .route("/api/users")
  .get(async (req, res) => {
    try {
      const doc = await User.find().select({ username: 1, _id: 1 }).exec();
      res.json(doc);
    } catch (err) {
      res.json({ error: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const username = req.body.username;
      const doc = await new User({ username }).save();

      res.json({ username: doc.username, _id: doc._id });
    } catch (err) {
      res.json({ error: err.message });
    }
  });

app.post("/api/users/:_id/exercises", async (req, res) => {
  const userId = req.params._id;
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

app.get("/api/users/:_id/logs", buildQuery, async (req, res) => {
  try {
    const doc = await res.query.exec();
    const { username, _id, exerciseLogs: rawLog } = doc[0];

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
