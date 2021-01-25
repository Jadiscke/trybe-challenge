const { Router } = require("express");
const userController = require("../controllers/userController");

const PATH = "/login";
const userRoutes = Router();

userRoutes.post(PATH, userController.login);

module.exports = userRoutes;
