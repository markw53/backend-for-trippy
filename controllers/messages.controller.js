const { fetchMessagesByRoomId, addMessageToRoom } = require("../models/messages.model");

exports.getMessagesByRoomId = (request, response, next) => {
  const { room_id } = request.params;

  fetchMessagesByRoomId(room_id)
    .then((messages) => {
      if (!messages.length) {
        return Promise.reject({ status: 404, msg: "No messages found for this room" });
      }
      response.status(200).send({ messages });
    })
    .catch(next);
};

exports.postMessageToRoom = (request, response, next) => {
  const { room_id } = request.params;
  const { user_id, content } = request.body;

  addMessageToRoom({ user_id, room_id, content })
    .then((newMessage) => {
      response.status(201).send({ message: newMessage });
    })
    .catch(next);
};
