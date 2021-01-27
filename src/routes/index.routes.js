const { Router } = require("express");
const userRoutes = require("./user.routes");
const loginRoutes = require("./login.routes");
const postRoutes = require("./post.routes");
const routes = Router();

routes.use([userRoutes, loginRoutes, postRoutes]);
routes.get("/", (req, res) => {
  res.json({ status: "ok", on: req.url });
});

module.exports = routes;
