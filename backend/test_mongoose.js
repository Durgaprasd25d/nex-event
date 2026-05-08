const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  dateField: { type: Date }
});
const Model = mongoose.model('TestDate', schema);
const doc = new Model({ dateField: null });
const err = doc.validateSync();
console.log("Error:", err);
