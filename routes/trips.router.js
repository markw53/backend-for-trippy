const express = require("express");
const {
  getAllTrips,
  getTrip,
  createTrip,
  patchTrip,
  deleteTrip,
  inviteUserToTrip,
  getTripMembers,
  removeTripMember,
} = require("../controllers/trips.controller");

const tripsRouter = express.Router();

tripsRouter.get("/", getAllTrips);
tripsRouter.post("/", createTrip);

tripsRouter.get("/:trip_id", getTrip);
tripsRouter.patch("/:trip_id", patchTrip);
tripsRouter.delete("/:trip_id", deleteTrip);

tripsRouter.get("/:trip_id/members", getTripMembers);
tripsRouter.post("/:trip_id/members", inviteUserToTrip);
tripsRouter.delete("/:trip_id/members", removeTripMember);

module.exports = tripsRouter;
