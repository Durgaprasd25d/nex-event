const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clean existing data
    await Event.deleteMany({});
    await User.deleteMany({});

    // Create an Admin
    const admin = new User({
      name: 'Admin User',
      email: 'tattoworld83@gmail.com',
      password: 'password123',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created');

    const events = [
      {
        title: 'Global Tech Summit 2026',
        description: 'Join industry leaders and innovators for the most anticipated tech event of the year. Explore deep dives into AI, Quantum Computing, and Sustainable Tech. Networking sessions and keynote speeches by world-class experts.',
        date: new Date('2026-06-15T09:00:00'),
        location: 'San Francisco, CA & Online',
        capacity: 5000,
        registrationsCount: 1240,
        creator: admin._id,
        image: 'https://images.unsplash.com/photo-1540575861501-7ad0586b2b93?auto=format&fit=crop&q=80&w=1200'
      },
      {
        title: 'Creative UI/UX Masterclass',
        description: 'Master the art of Glassmorphism and modern web design in this intensive 3-day workshop. Learn from senior designers at top SaaS companies and build your own premium design system from scratch.',
        date: new Date('2026-04-20T10:00:00'),
        location: 'Holographic Hub, NYC',
        capacity: 200,
        registrationsCount: 185,
        creator: admin._id,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200'
      },
      {
        title: 'Pitch Perfect: Startup Night',
        description: 'Connect with early-stage investors and visionary founders. Our monthly pitch night features 5 selected startups competing for $50k in seed funding and exclusive mentorship. Drinks and networking provided.',
        date: new Date('2026-05-12T18:30:00'),
        location: 'Sky Lounge, Dubai',
        capacity: 350,
        registrationsCount: 290,
        creator: admin._id,
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200'
      },
      {
        title: 'AI in SaaS: The New Frontier',
        description: 'Discover how LLMs are revolutionizing business automation and user experience. A deep dive into integrating Gemini and other AI models into your enterprise architecture. Expert-led technical sessions.',
        date: new Date('2026-07-05T14:00:00'),
        location: 'Virtual Event (Zoom & Metaverse)',
        capacity: 1000,
        registrationsCount: 412,
        creator: admin._id,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200'
      }
    ];

    await Event.insertMany(events);
    console.log('Database seeded with original content events');

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
