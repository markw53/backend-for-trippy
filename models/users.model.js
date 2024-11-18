const db = require("../db/connection");

exports.fetchAllUsers = () => {
  return db
    .query(
      `
        SELECT * FROM users
        `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchUser = (user_id) => {
  return db
    .query(`SELECT * FROM users WHERE user_id = $1`, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: User Not Found" });
      }
      return result.rows[0];
    });
};
