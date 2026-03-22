const dotenv = require('dotenv');
dotenv.config();

const env = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') ? 'prod' : 'dev';

const config = {
  dev: {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGODB_URI,
    ALLOWED_ORIGINS: [
      'http://localhost:5173',
      'http://localhost:3000'
    ]
  },
  prod: {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGODB_URI,
    ALLOWED_ORIGINS: [
      'https://nex-event-seven.vercel.app',
      'https://nex-event.onrender.com'
    ]
  }
};

module.exports = config[env];
