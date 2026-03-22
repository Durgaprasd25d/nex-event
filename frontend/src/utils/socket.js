import { io } from 'socket.io-client';
import config from '../config';

const socketUrl = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') 
  : config.SOCKET_URL;

const socket = io(socketUrl, {
  autoConnect: true,
  reconnection: true,
});

console.log('Socket initialized on domain:', socketUrl);

export default socket;
