const { Router } = require("express");
const userController = require("../controllers/userController");

const PATH = "/login";
const loginRoutes = Router();

loginRoutes.post(PATH, userController.login);

module.exports = loginRoutes;
