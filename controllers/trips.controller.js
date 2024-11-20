const {
  fetchAllTrips,
  fetchTrip,
  insertTrip,
  updateTrip,
  removeTripById,
  addTripMember,
  fetchTripMembers,
  deleteTripMember,
} = require("../models/trips.model");

const checkIfAdmin = require("../utils")


exports.getAllTrips = (request, response, next) => {
  fetchAllTrips()
    .then(trip => {
      response.status(200).send(trip);
    })
    .catch(next);
};

exports.getTrip = (request, response, next) => {
  const { trip_id } = request.params;
  fetchTrip(trip_id)
    .then(trip => {
      response.status(200).send({ trip });
    })
    .catch(next);
};

exports.createTrip = (request, response, next) => {
  const {
    trip_name,
    location,
    description,
    start_date,
    end_date,
    created_by,
    trip_img_url
  } = request.body;
  insertTrip(
    trip_name,
    location,
    description,
    start_date,
    end_date,
    created_by,
    trip_img_url
  )
    .then(trip => {
      response.status(201).send({ trip });
    })
    .catch(next);
};

exports.patchTrip = (request, response, next) => {
  const { trip_id } = request.params;
  const {
    trip_name,
    location,
    description,
    start_date,
    end_date,
    created_by,
    trip_img_url
  } = request.body;

  updateTrip(
    trip_id,
    trip_name,
    location,
    description,
    start_date,
    end_date,
    created_by,
    trip_img_url
  )
    .then(updatedTrip => {
      response.status(200).send({ trip: updatedTrip });
    })
    .catch(next);
};

exports.deleteTrip = (req, res, next) => {
  const { trip_id } = req.params;
  const { user_id } = req.user;
  checkIfAdmin(trip_id, user_id).then(adminStatus => {
    if (!adminStatus) {
      Promise.reject({ status: 403, msg: "Operation not allowed" });
    }
    return removeTripById(trip_id)
      .then(deletedTrip => {
        if (!deletedTrip) {
          return res.status(404).send({ msg: "Trip not found" });
        }
        res.status(200).send({ msg: "Trip deleted!", trip: deletedTrip });
      })
      .catch(next);
  });
};

exports.inviteUserToTrip = (request, response, next) => {
  const { trip_id } = request.params;
  const { user_id } = request.body;

  addTripMember(trip_id, user_id)
    
    .then((member) => {
      response.status(201).send({ member });
    })
    .catch(next);
};

exports.getTripMembers = (request, response, next) => {
  const { trip_id } = request.params;

  fetchTripMembers(trip_id)
    .then((members) => {
      response.status(200).send({ members });
    })
    .catch(next);
};

exports.removeTripMember = (request, response, next) => {
  const { trip_id } = request.params;
  const { user_id } = request.body;

  deleteTripMember(trip_id, user_id)
  
    .then(() => {
      response.status(200).send({ msg: "User Was Removed From The Trip"});
    })
    .catch(next);
};