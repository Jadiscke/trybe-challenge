const { Router } = require("express");
const userRoutes = require("./user.routes");
const routes = Router();

routes.use([userRoutes]);
routes.get("/", (req, res) => {
  res.json({ status: "ok", on: req.url });
});

module.exports = routes;
