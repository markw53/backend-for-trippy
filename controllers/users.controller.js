const {
  fetchAllUsers,
  fetchUser,
  insertUser,
  changeUserById,
  removeUser,
  fetchUserIdByEmail,
  fetchTripsByUserId
} = require("../models/users.model");

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

exports.createUser = (request, response, next) => {
  const { email, name } = request.body;
  insertUser(email, name)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch(next);
};

exports.updateUser = (request, response, next) => {
  const { user_id } = request.params;
  changeUserById(user_id, request.body)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch(next);
};

exports.deleteUser = (request, response, next)=>{
  const {user_id } = request.params;
  removeUser(user_id)
  .then(()=>{
    response.status(204).send();
  })
  .catch(next);
}
exports.getUserIdByEmail = (request, response, next) => {
  const { email } = request.params
  fetchUserIdByEmail(email)
  .then((userId) => {
    response.status(200).send({userId})
  })
  .catch(next)
}

exports.getTripsByUserId = (request, response, next) => {
  const { user_id } = request.params
  fetchTripsByUserId(user_id)
  .then((trips) => {
    response.status(200).send({trips})
  }) 
  .catch(next)
}