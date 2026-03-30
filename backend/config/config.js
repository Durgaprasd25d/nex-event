const dotenv = require('dotenv');
dotenv.config();

const normalizeOrigin = (origin = '') => origin.trim().replace(/\/$/, '');

const envAllowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  process.env.CORS_ORIGIN,
  ...(process.env.ALLOWED_ORIGINS || '').split(',')
]
  .map(normalizeOrigin)
  .filter(Boolean);

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://nex-event-seven.vercel.app',
  'https://nex-event-b5wl.onrender.com',
  'https://nex-event.onrender.com',
  ...envAllowedOrigins
].map(normalizeOrigin)
  .filter(Boolean)
  .filter((origin, index, origins) => origins.indexOf(origin) === index);

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/nex-event(?:-[a-z0-9-]+)?\.vercel\.app$/,
  /^https:\/\/nex-event(?:-[a-z0-9-]+)?\.onrender\.com$/
];

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);

  return ALLOWED_ORIGINS.includes(normalizedOrigin) ||
    ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(normalizedOrigin));
};

const resolveCorsOrigin = (origin, callback) => {
  if (isAllowedOrigin(origin)) {
    return callback(null, true);
  }

  return callback(new Error(`Origin ${origin} not allowed by CORS`));
};

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGODB_URI,
  ALLOWED_ORIGINS,
  resolveCorsOrigin
};
