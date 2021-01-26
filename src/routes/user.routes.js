const { Router } = require("express");
const userController = require("../controllers/userController");
const authenticationMiddleware = require("../middlewares/authentication");

const PATH = "/user";
const userRoutes = Router();

userRoutes.get(
  PATH,
  authenticationMiddleware.authenticateToken,
  userController.getUsers
);
userRoutes.post(PATH, userController.create);

module.exports = userRoutes;
