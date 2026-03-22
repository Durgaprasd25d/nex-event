const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('creator', 'name');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('creator', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, capacity, rows, cols, tags, entryCutoff, timeline } = req.body;
    const image = req.file ? req.file.path : req.body.image; 

    const parsedTimeline = typeof timeline === 'string' ? JSON.parse(timeline) : timeline;

    const event = new Event({
      title,
      description,
      date,
      location,
      capacity: capacity || (rows * cols),
      image,
      rows: rows || 10,
      cols: cols || 10,
      tags: tags || [],
      entryCutoff: entryCutoff || null,
      timeline: parsedTimeline || [],
      creator: req.user.id,
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: unauthorized' });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: unauthorized' });
    }

    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
