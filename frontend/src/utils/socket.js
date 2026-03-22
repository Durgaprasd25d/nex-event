import { io } from 'socket.io-client';

// Helper to strip /api from the URL to get the base domain for Socket.io
const getBaseUrl = (apiUrl) => {
  if (!apiUrl) return 'http://localhost:5000';
  return apiUrl.replace(/\/api$/, '');
};

const socketUrl = getBaseUrl(import.meta.env.VITE_API_URL);
const socket = io(socketUrl, {
  autoConnect: true,
  reconnection: true,
});

console.log('Socket initialized on domain:', socketUrl);

export default socket;
