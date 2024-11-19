const db = require("./db/connection");

exports.checkIfAdmin = (trip_id, user_id) => {
    return db.query(`
      SELECT is_admin
      FROM trip_members
      WHERE trip_id = $1
      AND user_id = $2
      ` [trip_id, user_id]
    ).then ((result) => {
      return result.rows[0].is_admin
    });
  };