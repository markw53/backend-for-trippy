const express = require("express");

const {
    getMessagesByRoomId,
    postMessageToRoom,
} = require("../controllers/messages.controller");

const messagesRouter = express.Router();

messagesRouter.get("/:room_id/messages", getMessagesByRoomId);
messagesRouter.post("/:room_id/messages", postMessageToRoom);

module.exports = messagesRouter;
