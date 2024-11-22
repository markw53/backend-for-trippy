const db = require("../db/connection");

exports.fetchAllActivities = (trip_id) => {
  return db
    .query(
      `
      SELECT * FROM activities
      WHERE trip_id = $1
      `,
      [trip_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Trip not found" });
      }
      return result.rows;
    });
};
exports.fetchActivityById = (activity_id) => {
  return db
    .query(`SELECT * FROM activities WHERE activity_id = $1`, [activity_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: Activity Not Found" });
      }
      return result.rows[0];
    });
};

exports.insertActivity = (trip_id, activity_name, description, date, time, 
  activity_img_url) => {
  if (!activity_name || !date) {
    return Promise.reject({
      status: 400,
      msg: "Missing required fields: activity_name, date are mandatory",
    });
  }
  const timeValue = time || null;
  return db
    .query(
      `
      INSERT INTO activities (trip_id, activity_name, description, date, time, activity_img_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [trip_id, activity_name, description, date, timeValue, activity_img_url]
    )
    .then((result) => result.rows[0]);
};

exports.updateActivity = (
  activity_id,
  activity_name,
  description,
  date,
  time,
  in_itinerary,
  votes,
  activity_img_url
) => {
  if (
    !activity_name &&
    !description &&
    !date &&
    !time &&
    in_itinerary === undefined &&
    votes === undefined &&
    !activity_img_url
  ) {
    return Promise.reject({
      status: 400,
      msg: "400: Bad Request - No updates provided",
    });
  }

  return db
    .query(
      `
      UPDATE activities
      SET 
          activity_name = COALESCE($2, activity_name),
          description = COALESCE($3, description),
          date = COALESCE($4, date),
          time = COALESCE($5, time),
          in_itinerary = COALESCE($6, in_itinerary),
          votes = COALESCE($7, votes),
          activity_img_url = COALESCE($8, activity_img_url)
      WHERE activity_id = $1
      RETURNING *;
      `,
      [activity_id, activity_name, description, date, time, in_itinerary, votes, activity_img_url]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Activity not found" });
      }
      return result.rows[0];
    });
};


exports.removeActivityById = (activity_id) => {
  return db
    .query(
      `
      DELETE FROM activities
      WHERE activity_id = $1
      RETURNING *;
      `,
      [activity_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Activity not found" });
      }
      return result.rows[0];
    });
};

exports.fetchItinerary = (trip_id) => {
  return db
    .query(
      `
    SELECT * FROM activities WHERE in_itinerary = true AND trip_id = $1
    ORDER BY date ASC
    `,
      [trip_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: Not Found" });
      }
      return result.rows;
    });
};

exports.fetchPossibility = (trip_id) => {
  return db
    .query(
      `
    SELECT * FROM activities WHERE in_itinerary = false AND trip_id = $1
    `,
      [trip_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: Not Found" });
      }
      return result.rows;
    });
};
