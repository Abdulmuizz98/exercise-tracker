const mongoose = require("mongoose");
const dbUri = process.env.MONGO_URI;
const connection = mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.export = connection;
