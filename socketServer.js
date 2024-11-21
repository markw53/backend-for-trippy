const http = require('http');
const { Server } = require('socket.io');
const express = require('express');

const initializeSocketServer = (app) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('send_message', (data) => {
      console.log('Message received:', data);
      io.emit('receive_message', data); 
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected', socket.id);
    });
  });

  return server;
};

module.exports = initializeSocketServer;
