const db = require("../db/connection");

exports.fetchAllTrips = () => {
  return db
    .query(
      `
        SELECT * FROM trips
        `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchTrip = (trip_id) => {
  return db
    .query(`SELECT * FROM trips WHERE trip_id = $1`, [trip_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Trip not found" });
      }
      return result.rows[0];
    });
};

exports.insertTrip = (trip_name, location, description, start_date, end_date, created_by, trip_img_url) => {
  return db.query(
    `
    INSERT INTO trips (trip_name, location, description, start_date, end_date, created_by, trip_img_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, [trip_name, location, description, start_date, end_date, created_by, trip_img_url]
  )
  .then((result) => result.rows[0])
}