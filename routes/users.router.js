const express = require("express");
const { getAllUsers, getUser } = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:user_id", getUser);

module.exports = usersRouter;
