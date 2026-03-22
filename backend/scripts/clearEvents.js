const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from the parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Message = require('../models/Message');
const Feedback = require('../models/Feedback');

async function clearStaticData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for cleanup...');

    const eventCount = await Event.countDocuments();
    const regCount = await Registration.countDocuments();
    
    console.log(`Found ${eventCount} events and ${regCount} registrations.`);

    await Event.deleteMany({});
    await Registration.deleteMany({});
    await Message.deleteMany({});
    await Feedback.deleteMany({});

    console.log('Successfully cleared all static events, registrations, messages, and feedback.');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
}

clearStaticData();
