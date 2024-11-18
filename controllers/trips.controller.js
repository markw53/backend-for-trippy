const { fetchAllTrips, fetchTrip } = require("../models/trips.model");

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
