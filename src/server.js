const routes = require("./routes/index.routes");
const express = require("express");
const db = require("./db");
const PORT = process.env.PORT ?? 3000;
const server = express();

server.use(express.json());
server.use(routes);
server.listen(PORT, () => {
  console.log("Listening on: ", PORT);
});
