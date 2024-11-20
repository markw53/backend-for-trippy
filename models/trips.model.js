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

exports.insertTrip = (
  trip_name,
  location,
  description,
  start_date,
  end_date,
  created_by,
  trip_img_url
) => {
  if (!trip_name || !location || !start_date || !end_date || !created_by) {
    return Promise.reject({
      status: 400,
      msg: "Missing required fields: trip_name, location, start_date, end_date, created_by are mandatory",
    });
  }
  return db
    .query(
      `
    INSERT INTO trips (trip_name, location, description, start_date, end_date, created_by, trip_img_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `,
      [
        trip_name,
        location,
        description,
        start_date,
        end_date,
        created_by,
        trip_img_url,
      ]
    )

    .then((result) => {
      const { trip_id } = result.rows[0];

      return db.query(
        `
        INSERT INTO trip_members (trip_id, user_id, admin)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [trip_id, created_by, true]
      );
    })
    .then((result) => result.rows[0]);
};

exports.updateTrip = (
  trip_id,
  trip_name,
  location,
  description,
  start_date,
  end_date,
  trip_img_url
) => {
  return db
    .query(
      `
    UPDATE trips
    SET trip_name = $2,
      location = $3,
      description = $4,
      start_date = $5,
      end_date = $6,
      trip_img_url = $7
    WHERE trip_id = $1
    RETURNING *
    `,
      [
        trip_id,
        trip_name,
        location,
        description,
        start_date,
        end_date,
        trip_img_url,
      ]
    )
    .then((result) => result.rows[0]);
};

exports.removeTripById = (trip_id) => {
  const queryStr = `
    DELETE FROM trips
    WHERE trip_id = $1
    RETURNING *;
  `;

  return db.query(queryStr, [trip_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.addTripMember = (trip_id, user_id) => {
  if (!user_id) {
    return Promise.reject({
      status: 400,
      msg: "400: Bad Request - Missing required field: user_id",
    });
  }
  return db
    .query(
      `
      INSERT INTO trip_members (trip_id, user_id)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [trip_id, user_id]
    )
    .then((result) => result.rows[0]);
};

exports.fetchTripMembers = (trip_id) => {
  return db
    .query(`SELECT * FROM trips WHERE trip_id = $1`, [trip_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Trip not found" });
      }

      return db
        .query(
          `
      SELECT trip_members.trip_member_id, trip_members.user_id, trip_members.is_admin, users.name, users.avatar_url
      FROM trip_members
      JOIN users ON trip_members.user_id = users.user_id
      WHERE trip_members.trip_id = $1;
      `,
          [trip_id]
        )
        .then((result) => result.rows);
    });
};

exports.deleteTripMember = (trip_id, user_id) => {
  if (!trip_id || !user_id) {
    return Promise.reject({
      status: 404,
      msg: "Missing required fields: trip_id and user_id are mandatory",
    }) }
  return db
    .query(
      `
      DELETE FROM trip_members
      WHERE trip_members.trip_id = $1 AND trip_members.user_id = $2
      RETURNING *;
      `,
      [trip_id, user_id]
    )
    .then((result) => result.rows[0]);
};
