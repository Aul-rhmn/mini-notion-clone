const { Server } = require('socket.io');

const allowedOrigins = [
  'https://mini-notion-clone.vercel.app',
  'https://mini-notion-clone-git-main-aul-rhmns-projects.vercel.app'
];
const initializeSocket = (server) => {
  const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on('note:join', (noteId) => {
      socket.join(noteId);
      console.log(`User ${socket.id} joined room ${noteId}`);
    });
    socket.on('block:update', ({ noteId, blockData }) => {
      socket.to(noteId).emit('block:updated', blockData);
    });
  
    socket.on('block:create', ({ noteId, blockData }) => {
        socket.to(noteId).emit('block:created', blockData);
    });

    socket.on('block:delete', ({ noteId, blockId }) => {
        socket.to(noteId).emit('block:deleted', blockId);
    });


    socket.on('disconnect', () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
};

module.exports = { initializeSocket };