const express = require("express");
const {getAllTrips, getTrip, createTrip, patchTrip } = require("../controllers/trips.controller");

const tripsRouter = express.Router();

tripsRouter.get("/", getAllTrips);
tripsRouter.get("/:trip_id", getTrip);
tripsRouter.post("/", createTrip)
tripsRouter.patch("/:trip_id", patchTrip)


module.exports = tripsRouter;
