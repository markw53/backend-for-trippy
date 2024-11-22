const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate } = require("./utils");

const seed = ({ userData, tripsData, tripMembersData, activitiesData, roomsData, messagesData }) => {
  return db
  .query(`DROP TABLE IF EXISTS messages CASCADE;`)
  .then(() => db.query(`DROP TABLE IF EXISTS rooms CASCADE;`))
  .then(() => db.query(`DROP TABLE IF EXISTS activities CASCADE;`))
  .then(() => db.query(`DROP TABLE IF EXISTS trip_members CASCADE;`))
  .then(() => db.query(`DROP TABLE IF EXISTS trips CASCADE;`))
  .then(() => db.query(`DROP TABLE IF EXISTS users CASCADE;`))
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          user_id SERIAL PRIMARY KEY,
          name VARCHAR NOT NULL,
          avatar_url VARCHAR,
          email VARCHAR(100) UNIQUE,
          created_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE trips (
          trip_id SERIAL PRIMARY KEY,
          trip_name VARCHAR(100) NOT NULL,
          location VARCHAR(100) NOT NULL,
          description TEXT,
          start_date DATE NOT NULL,
          end_date DATE,
          created_by INT REFERENCES users(user_id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT NOW(),
          trip_img_url VARCHAR(100)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE activities (
          activity_id SERIAL PRIMARY KEY,
          trip_id INT REFERENCES trips(trip_id) ON DELETE CASCADE,
          activity_name VARCHAR(255) NOT NULL,
          in_itinerary BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          date DATE NOT NULL,
          time TIME,
          description TEXT,
          votes INT DEFAULT 0,
          activity_img_url VARCHAR 
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE trip_members (
          trip_member_id SERIAL PRIMARY KEY,
          trip_id INT REFERENCES trips(trip_id) ON DELETE CASCADE,
          user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
          is_admin BOOLEAN DEFAULT FALSE
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE rooms (
          room_id SERIAL PRIMARY KEY,
          trip_id INT REFERENCES trips(trip_id) ON DELETE CASCADE,
          room_name VARCHAR(50) NOT NULL UNIQUE
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE messages (
          message_id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
          room_id INT REFERENCES rooms(room_id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
    })
    .then(() => {
      const insertUserQueryStr = format(
        "INSERT INTO users (name, avatar_url, email) VALUES %L;",
        userData.map(({ name, avatar_url, email }) => [name, avatar_url, email])
      );

      return db.query(insertUserQueryStr);
    })
    .then(() => {
      const insertTripQueryStr = format(
        "INSERT INTO trips (trip_name, location, description, start_date, end_date, created_by) VALUES %L;",
        tripsData.map(
          ({
            trip_name,
            location,
            description,
            start_date,
            end_date,
            created_by,
          }) => [
            trip_name,
            location,
            description,
            start_date,
            end_date,
            created_by,
          ]
        )
      );

      return db.query(insertTripQueryStr);
    })
    .then(() => {
      const formattedActivityData = activitiesData.activitiesData.map(
        convertTimestampToDate
      );
      const insertActivitiesQueryStr = format(
        "INSERT INTO activities (trip_id, activity_name, in_itinerary, date, time, description, votes, activity_img_url) VALUES %L;",
        formattedActivityData.map(
          ({
            trip_id,
            activity_name,
            in_itinerary,
            date,
            time,
            description,
            votes,
            activity_img_url,
          }) => [
            trip_id,
            activity_name,
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
        tripMembersData.map(({ trip_id, user_id, is_admin }) => [
          trip_id,
          user_id,
          is_admin,
        ])
      );
      return db.query(insertTripMembersQueryStr);
    })
    .then(() => {
      const insertRoomsQueryStr = format(
        "INSERT INTO rooms (trip_id, room_name) VALUES %L;",
        roomsData.map(({ trip_id, room_name }) => [trip_id, room_name])
      );
      return db.query(insertRoomsQueryStr);
    })
    .then(() => {
      const insertMessagesQueryStr = format(
        "INSERT INTO messages (user_id, room_id, content, timestamp) VALUES %L;",
        messagesData.map(({ user_id, room_id, content, timestamp }) => [
          user_id,
          room_id,
          content,
          timestamp || new Date().toISOString(),
        ])
      );
      return db.query(insertMessagesQueryStr);
    });
};

module.exports = seed;
