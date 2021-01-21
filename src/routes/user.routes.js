const { Router } = require("express");
const userController = require("../controllers/userController");

const PATH = "/users";
const userRoutes = Router();

userRoutes.get(PATH, userController.getUsers);
userRoutes.post(PATH, userController.create);

module.exports = userRoutes;
