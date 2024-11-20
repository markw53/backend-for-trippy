const express = require("express");
const {
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/activities.controller");

const activitiesRouter = express.Router({ mergeParams: true }); 

activitiesRouter.get("/", getActivities);
activitiesRouter.post("/", addActivity);
activitiesRouter.patch("/:activity_id", updateActivity);
activitiesRouter.delete("/:activity_id", deleteActivity);

module.exports = activitiesRouter;