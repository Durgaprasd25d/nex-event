const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { getIO } = require('../socket');

exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.registrationsCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const { seatNumber } = req.body;
    if (!seatNumber) return res.status(400).json({ message: 'Seat selection is required' });

    if (event.bookedSeats.includes(seatNumber)) {
      return res.status(400).json({ message: 'This seat is already booked' });
    }

    const registration = new Registration({
      user: req.user.id,
      event: eventId,
      seatNumber
    });
    await registration.save();

    event.registrationsCount += 1;
    event.bookedSeats.push(seatNumber);
    await event.save();

    res.status(201).json({ message: 'Registration successful', registration });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id }).populate('event');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrations = await Registration.find({ event: eventId }).populate('user', 'name email');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validateRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { registrationId } = req.body; // or decoded from QR

    const registration = await Registration.findById(registrationId).populate('event');
    if (!registration) return res.status(404).json({ message: 'Ticket not found' });

    // 1. Strict Event Binding
    if (registration.event._id.toString() !== eventId) {
      return res.status(400).json({ message: 'Ticket belongs to a different event' });
    }

    // 2. Usage Check (One-time entry)
    if (registration.isUsed) {
      return res.status(400).json({
        message: 'Ticket already scanned',
        scannedAt: registration.scannedAt
      });
    }

    // 3. Automated Entry Closure Check
    const event = registration.event;
    if (event.entryCutoff && new Date() > new Date(event.entryCutoff)) {
      return res.status(403).json({ message: 'Entry Window Closed' });
    }

    // 4. Mark as Used
    registration.isUsed = true;
    registration.scannedAt = new Date();
    await registration.save();

    // Emit real-time update to the room
    const io = getIO();
    io.to(eventId).emit('seatScanned', {
      eventId,
      registrationId: registration._id,
      seatNumber: registration.seatNumber,
      user: registration.user,
      scannedAt: registration.scannedAt
    });

    res.json({
      message: 'Access Granted',
      registration
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
