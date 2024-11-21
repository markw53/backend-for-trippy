const db = require("../db/connection");

exports.fetchMessagesByRoomId = (room_id) => {
  const query = `
    SELECT 
      messages.message_id,
      messages.content,
      messages.timestamp,
      users.name AS user_name,
      users.avatar_url
    FROM messages
    JOIN users ON messages.user_id = users.user_id
    WHERE messages.room_id = $1
    ORDER BY messages.timestamp ASC;
  `;

  return db
  .query(query, [room_id])
  .then((result) => result.rows);
};

exports.addMessageToRoom = ({ user_id, room_id, content }) => {
  const query = `
    INSERT INTO messages (user_id, room_id, content)
    VALUES ($1, $2, $3)
    RETURNING message_id, user_id, room_id, content, timestamp;
  `;

  return db.query(query, [user_id, room_id, content]).then((result) => result.rows[0]);
};
