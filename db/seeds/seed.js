const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate } = require("./utils");

const seed = ({ userData, tripsData, tripMembersData, activitiesData }) => {
  return db
    .query(`DROP TABLE IF EXISTS activities;`)
    .then(() => db.query(`DROP TABLE IF EXISTS trip_members;`))
    .then(() => db.query(`DROP TABLE IF EXISTS trips;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(() => {
      const usersTablePromise = db.query(`
        CREATE TABLE users (
          user_id SERIAL PRIMARY KEY,
          name VARCHAR NOT NULL,
          avatar_url VARCHAR,
          email VARCHAR(100),
          created_at TIMESTAMP DEFAULT NOW()
        );`);

      const tripsTablePromise = db.query(`
        CREATE TABLE trips (
          trip_id SERIAL PRIMARY KEY,
          trip_name VARCHAR(100) NOT NULL,
          location VARCHAR(100) NOT NULL,
          description TEXT,
          start_date DATE NOT NULL,
          end_date DATE,
          created_by INT REFERENCES users(user_id),
          created_at TIMESTAMP DEFAULT NOW(),
          trip_img_url VARCHAR(100)
        );`);

      return Promise.all([usersTablePromise, tripsTablePromise]);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE activities (
          activity_id SERIAL PRIMARY KEY,
          trip_id INT REFERENCES trips(trip_id),
          in_itinerary BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          date DATE NOT NULL,
          time TIME,
          description TEXT,
          votes INT DEFAULT 0 NOT NULL,
          activity_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE trip_members (
          trip_member_id SERIAL PRIMARY KEY,
          trip_id INT REFERENCES trips(trip_id),
          user_id INT REFERENCES users(user_id),
          is_admin BOOLEAN DEFAULT FALSE
        );`);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (name, avatar_url, email) VALUES %L;",
        userData.map(({ name, avatar_url, email }) => [name, avatar_url, email])
      );

      const insertTripsQueryStr = format(
        "INSERT INTO trips (trip_name, location, description, start_date, end_date, created_by) VALUES %L;",
        tripsData.map(
          ({ trip_name, location, description, start_date, end_date, created_by }) => [
            trip_name,
            location,
            description,
            start_date,
            end_date,
            created_by,
          ]
        )
      );

      return Promise.all([db.query(insertUsersQueryStr), db.query(insertTripsQueryStr)]);
    })
    .then(() => {
      const formattedActivityData = activitiesData.map(convertTimestampToDate);
      const insertActivitiesQueryStr = format(
        "INSERT INTO activities (trip_id, in_itinerary, date, time, description, votes, activity_img_url) VALUES %L;",
        formattedActivityData.map(
          ({ trip_id, in_itinerary, date, time, description, votes, activity_img_url }) => [
            trip_id,
            in_itinerary,
            date,
            time,
            description,
            votes,
            activity_img_url,
          ]
        )
      );
      return db.query(insertActivitiesQueryStr);
    })
    .then(() => {
      const insertTripMembersQueryStr = format(
        "INSERT INTO trip_members (trip_id, user_id, is_admin) VALUES %L;",
        tripMembersData.map(({ trip_id, user_id, is_admin }) => [trip_id, user_id, is_admin])
      );
      return db.query(insertTripMembersQueryStr);
    });
};

module.exports = seed;
