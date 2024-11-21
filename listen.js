const app = require("./app.js");
const http = require("http");


const { PORT = 9090 } = process.env;
const server = http.createServer(app);

initializeSocketServer(server)
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
app.listen(PORT, () => console.log(`Listening on ${PORT}...`));