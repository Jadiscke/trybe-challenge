const PORT = process.env.PORT ?? 3000;

const server = require("./app");

server.listen(PORT, () => {
  console.log("Listening on: ", PORT);
});
