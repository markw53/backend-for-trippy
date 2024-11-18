const express = require("express");
const {getAllTrips, getTrip } = require("../controllers/trips.controller");

const tripsRouter = express.Router();

tripsRouter.get("/", getAllTrips);
tripsRouter.get("/:trip_id", getTrip);

module.exports = tripsRouter;
