const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  timeline: [{
    time: { type: String, required: true },
    activity: { type: String, required: true }
  }]
});
const Model = mongoose.model('TestTimeline', schema);
const doc = new Model({ timeline: [] });
const err = doc.validateSync();
console.log("Error:", err);
