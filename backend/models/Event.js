const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  registrationsCount: { type: Number, default: 0 },
  rows: { type: Number, default: 10 },
  cols: { type: Number, default: 10 },
  bookedSeats: { type: [String], default: [] },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String }, // Optional image URL
  tags: { type: [String], default: [] },
  entryCutoff: { type: Date }, // Time when entry closes
  timeline: [{
    time: { type: String, required: true },
    activity: { type: String, required: true }
  }],
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
