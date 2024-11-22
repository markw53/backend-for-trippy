const app = require("./app.js");
const http = require("http");
const initialiseSocketServer = require("./socketServer.js")


const { PORT = 9090 } = process.env;
const server = http.createServer(app);

initialiseSocketServer(server)
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
