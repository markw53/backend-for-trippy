const {
  fetchAllActivities,
  insertActivity,
  updateActivity,
  removeActivityById,
  fetchItinerary,
} = require("../models/activities.model");

exports.getActivities = (request, response, next) => {
  const { trip_id } = request.params;

  fetchAllActivities(trip_id)
    .then((activities) => {
      response.status(200).send({ activities });
    })
    .catch(next);
};

exports.addActivity = (request, response, next) => {
  const { trip_id } = request.params;
  const { activity_name, description, date, time } = request.body;

  insertActivity(trip_id, activity_name, description, date, time)
    .then((activity) => {
      response.status(201).send({ activity });
    })
    .catch(next);
};

exports.updateActivity = (request, response, next) => {
  const { activity_id } = request.params;
  const { activity_name, description, date, time } = request.body;

  updateActivity(activity_id, activity_name, description, date, time)
    .then((updatedActivity) => {
      response.status(200).send({ activity: updatedActivity });
    })
    .catch(next);
};

exports.deleteActivity = (request, response, next) => {
  const { activity_id } = request.params;

  removeActivityById(activity_id)
    .then(() => {
      response.status(200).send({ msg: "Activity deleted successfully" });
    })
    .catch(next);
};

exports.getItinerary = (request, response, next) => {
  const { trip_id } = request.params;
  fetchItinerary(trip_id)
    .then((activities) => {
      response.status(200).send({ activities });
    })
    .catch(next);
};
