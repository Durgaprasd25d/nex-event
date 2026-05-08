const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  location: { type: String, required: true }
});
const Model = mongoose.model('TestLocation', schema);
const doc = new Model({ location: '' });
const err = doc.validateSync();
console.log("Error:", err);
