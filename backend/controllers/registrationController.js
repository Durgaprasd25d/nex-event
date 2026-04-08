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

const PDFDocument = require('pdfkit');

exports.downloadTicket = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('user', 'name email')
      .populate('event');

    if (!registration) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const filename = `NEXUS-TICKET-${registration._id}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // --- Ticket Design ---
    
    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#050505');

    // Accent Line
    doc.rect(0, 0, 10, doc.page.height).fill('#00f2ff');

    // Header Branding
    doc.fillColor('#ffffff')
       .font('Helvetica-Bold')
       .fontSize(30)
       .text('NEXUS', 50, 50);
    
    doc.fillColor('#00f2ff')
       .font('Helvetica-Bold')
       .fontSize(30)
       .text('.', 155, 50);

    doc.fillColor('rgba(255,255,255,0.4)')
       .font('Helvetica')
       .fontSize(8)
       .text('SECURE IDENTITY TOKEN // 2026', 50, 85);

    // Event Info
    doc.fillColor('#ffffff')
       .font('Helvetica-Bold')
       .fontSize(40)
       .text(registration.event.title.toUpperCase(), 50, 140, { lineGap: 10 });

    doc.rect(50, 240, 500, 1).fill('grey');

    // Details Grid
    const gridY = 270;
    
    // Column 1
    doc.fillColor('rgba(255,255,255,0.5)').fontSize(10).text('HOLDER IDENTITY', 50, gridY);
    doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text(registration.user.name, 50, gridY + 20);

    doc.fillColor('rgba(255,255,255,0.5)').fontSize(10).text('CHRONOS (DATE)', 50, gridY + 70);
    doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text(new Date(registration.event.date).toDateString(), 50, gridY + 90);

    // Column 2
    doc.fillColor('rgba(255,255,255,0.5)').fontSize(10).text('SEAT COORDINATE', 300, gridY);
    doc.fillColor('#00f2ff').fontSize(32).font('Helvetica-Bold').text(registration.seatNumber, 300, gridY + 15);

    doc.fillColor('rgba(255,255,255,0.5)').fontSize(10).text('ZONE (LOCATION)', 300, gridY + 70);
    doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text(registration.event.location, 300, gridY + 90);

    // Bottom Protocol Info
    doc.rect(50, 420, 500, 100).fill('#111111');
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(12).text('ACCESS PROTOCOL', 70, 440);
    doc.fillColor('rgba(255,255,255,0.6)').font('Helvetica').fontSize(10).text(
      'Present this secure token at the entrance node. Unauthorized duplication will result in node decommissioning. Your digital presence is required at least 30 minutes prior to activation.',
      70, 460, { width: 460, lineGap: 5 }
    );

    // Footer Text
    doc.fillColor('rgba(255,255,255,0.2)')
       .font('Helvetica')
       .fontSize(8)
       .text(`TOKEN ID: ${registration._id}`, 50, doc.page.height - 70);
    
    doc.text('© 2026 NEXUS INDUSTRIAL SYSTEMS. ALL RIGHTS RESERVED.', 50, doc.page.height - 55);

    doc.end();

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
