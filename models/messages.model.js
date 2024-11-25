const db = require("../db/connection");

exports.fetchMessagesByRoomId = (room_id) => {
  const query = `
    SELECT 
      messages.message_id,
      messages.content,
      messages.timestamp,
      messages.user_id,
      users.name AS user_name,
      users.avatar_url
    FROM messages
    JOIN users ON messages.user_id = users.user_id
    WHERE messages.room_id = $1
    ORDER BY messages.timestamp ASC;
  `;

  return db
  .query(query, [room_id])
  .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: Room Not Found" });
      }
      return result.rows;
    })
};

exports.addMessageToRoom = ({ user_id, room_id, content }) => {
  if (!user_id || !room_id || !content) {
    return Promise.reject({
      status: 400,
      msg: "400: Bad Request - Missing required fields",
    });
  }
  const query = `
    INSERT INTO messages (user_id, room_id, content)
    VALUES ($1, $2, $3)
    RETURNING message_id, user_id, room_id, content, timestamp;
  `;

  return db.query(query, [user_id, room_id, content]).then((result) => result.rows[0])
  .catch(() => {
    return Promise.reject({ status: 404, msg: "404: Room Not Found" });
  });
};
