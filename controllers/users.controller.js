const { fetchAllUsers, fetchUser } = require("../models/users.model");

exports.getAllUsers = (request, response, next) => {
  fetchAllUsers()
    .then((users) => {
      response.status(200).send(users);
    })
    .catch(next);
};

exports.getUser = (request, response, next) => {
  const { user_id } = request.params;
  fetchUser(user_id)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch(next);
};
