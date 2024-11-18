const { fetchEndPoints } = require('../models/endPoints.model');

exports.getEndPoints = (request, response, next) => {
    fetchEndPoints()
    .then(endpoint => {
    response.status(200).send(endpoint);
    })
    .catch((error) => {
        next(error);
    })
    }