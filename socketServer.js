const { Server } = require("socket.io");

function initialiseSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",// CHANGE THIS BEFORE PRODUCTION
    },
  });

  io.on("connection", (socket) => {
    console.log(`New WebSocket connection: ${socket.id}`);

    socket.on("message", (msg) => {
      console.log(`Message received: ${msg}`);
      io.emit("message", msg); 
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initialiseSocketServer;
