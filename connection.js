const mongoose = require("mongoose");
const dbUri = process.env.MONGO_URI;
const connection = mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAndSaveDoc = async (model, data, done) => {
  // Callers should handle err in a try...catch
  let newDoc = new model(data);
  const doc = await newDoc.save().then(done);
  return doc;
};

const findOneDoc = async (model, condition, done) => {
  // Callers should handle err in a try...catch
  const doc = await model.findOne(condition).then(done);
  return doc;
};

const findDocById = async (id, done) => {
  // Callers should handle err in a try...catch
  const doc = await model.findById(id).then(done);
  return doc;
};

const findEditThenSaveDoc = async (model, id, edit, done) => {
  // Callers should handle err in a try...catch
  const doc = await model.findById(id).then(edit); // find and edit
  doc.save().then(done); // save editted doc then do "done"
  return doc;
};
const findByIdAndUpdateDoc = async (model, id, update, options, done) => {
  // Callers should handle err in a try...catch
  const doc = await model
    .findByIdAndUpdate(
      id,
      update,
      options // To return the updated user document
    )
    .then(done);
  return doc;
};

// exports.createAndSaveDoc = createAndSaveDoc;
// exports.findOneDoc = findOneDoc;
// exports.findDocById = findDocById;
// exports.findEditThenSaveDoc = findEditThenSaveDoc;
// exports.findByIdAndUpdateDoc = findByIdAndUpdateDoc;

module.export = connection;
