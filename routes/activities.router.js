const express = require("express");
const {
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  getActivityById,
} = require("../controllers/activities.controller");

const activitiesRouter = express.Router({ mergeParams: true }); 

activitiesRouter.get("/", getActivities);
activitiesRouter.post("/", addActivity);
activitiesRouter.get("/:activity_id", getActivityById);
activitiesRouter.patch("/:activity_id", updateActivity);
activitiesRouter.delete("/:activity_id", deleteActivity);

module.exports = activitiesRouter;