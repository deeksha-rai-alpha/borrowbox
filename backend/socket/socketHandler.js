const jwt = require("jsonwebtoken");

// Keeps track of which socket belongs to which user (in-memory map, FR-19)
const onlineUsers = new Map(); // userId -> socketId

let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  // Authenticate socket connections using the same JWT used for the REST API
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication token missing"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    console.log(`Socket connected: user ${socket.userId}`);

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId);
      console.log(`Socket disconnected: user ${socket.userId}`);
    });
  });
};

// Called from controllers to push a real-time notification to a specific user
const emitToUser = (userId, event, data) => {
  if (!ioInstance) return;
  const socketId = onlineUsers.get(userId.toString());
  if (socketId) {
    ioInstance.to(socketId).emit(event, data);
  }
};

module.exports = { initSocket, emitToUser };
