const express = require("express");
const {getAllTrips, getTrip, createTrip } = require("../controllers/trips.controller");

const tripsRouter = express.Router();

tripsRouter.get("/", getAllTrips);
tripsRouter.get("/:trip_id", getTrip);
tripsRouter.post("/", createTrip)

module.exports = tripsRouter;
