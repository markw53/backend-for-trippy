const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:user_id", getUser);
usersRouter.post("/", createUser);
usersRouter.patch("/:user_id", updateUser);
usersRouter.delete("/:user_id", deleteUser)

module.exports = usersRouter;
