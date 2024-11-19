const { response } = require("../app");
const { fetchAllTrips, fetchTrip, insertTrip } = require("../models/trips.model");

exports.getAllTrips = (request, response, next) => {
  fetchAllTrips()
    .then((trip) => {
      response.status(200).send(trip);
    })
    .catch(next);
};

exports.getTrip = (request, response, next) => {
  const { trip_id } = request.params;
  fetchTrip(trip_id)
    .then((trip) => {
      response.status(200).send({ trip });
    })
    .catch(next);
};

exports.createTrip = (request, response, next) => {
  const { trip_name, location, description, start_date, end_date, created_by, trip_img_url } = request.body
  insertTrip(trip_name, location, description, start_date, end_date, created_by, trip_img_url)
  .then((trip) => {
    response.status(201).send({ trip })
  })
  .catch(next)
}