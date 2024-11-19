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

exports.insertUser = (email, name) => {
  return db
    .query(
      `INSERT INTO users (email, name)
       VALUES ($1, $2) RETURNING *`,
      [email, name]
    )
    .then((result) => result.rows[0]);
};

exports.changeUserById = (user_id, body) => {
  const { name, avatar_url } = body;

  if (typeof name !== "string" || typeof avatar_url !== "string") {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  }

  return db
    .query(
      `
    UPDATE users SET name = $1, avatar_url = $2 WHERE user_id = $3
    RETURNING *`,
      [name, avatar_url, user_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: User Not Found" });
      }
      return result.rows[0];
    });
};

  exports.removeUser = (user_id)=>{
    return db.query(
      `DELETE FROM users
      WHERE user_id = $1
      RETURNING *`,[user_id]
    )
    .then((result)=>{
          if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: Not Found" });
      }
    });
  }