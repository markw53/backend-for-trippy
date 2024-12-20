const cors = require("cors");
const express = require("express");
const app = express();
const { getEndPoints } = require("./controllers/endPoints.controller");

const usersRouter = require("./routes/users.router");
const tripsRouter = require("./routes/trips.router");
const messagesRouter = require("./routes/messages.router")

app.use(cors());
app.use(express.json());

app.get("/api", getEndPoints);
app.use("/api/users", usersRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/rooms", messagesRouter);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "404: Not Found" });
});

app.use((error, request, response, next) => {
  if (error.status) {
    response.status(error.status).send({ msg: error.msg });
  } else if (error.code === "22P02" || error.code === "23502") {
    response.status(400).send({ msg: "400: Bad Request" });
  } else if (error.code === "23503") {
    response.status(404).send({ msg: "404: Trip or User Not Found" });
  } else {
    response.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
