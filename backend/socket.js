const { Server } = require('socket.io');
const config = require('./config/config.js');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: config.ALLOWED_ORIGINS,
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected to socket:', socket.id);

    socket.on('joinEvent', (eventId) => {
      socket.join(eventId);
      console.log(`Socket ${socket.id} joined event room: ${eventId}`);
    });

    socket.on('sendMessage', (data) => {
      // data: { eventId, user, text }
      io.to(data.eventId).emit('newMessage', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from socket');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };
