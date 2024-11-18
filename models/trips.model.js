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
