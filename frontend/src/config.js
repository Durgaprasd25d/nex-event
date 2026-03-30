const env = (import.meta.env.VITE_APP_ENV === 'production' || import.meta.env.VITE_APP_ENV === 'prod') ? 'prod' : 'dev';

const config = {
  dev: {
    API_URL: 'http://localhost:5000/api',
    SOCKET_URL: 'http://localhost:5000'
  },
  prod: {
    API_URL: 'https://nex-event-b5wl.onrender.com/api',
    SOCKET_URL: 'https://nex-event-b5wl.onrender.com'
  }
};

export default config[env];
