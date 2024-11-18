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

exports.fetchUser = (email) => {
  return db
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user not found" });
      }
      return result.rows;
    });
};
