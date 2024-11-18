const endpoints = require("../endpoints.json");

exports.fetchEndPoints = () => {
  return Promise.resolve(endpoints);
};