const express = require("express");
const { getAllUsers, getUser, createUser } = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:user_id", getUser);
usersRouter.post("/", createUser);

module.exports = usersRouter;
