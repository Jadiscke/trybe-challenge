const { Router } = require("express");
const userController = require("../controllers/userController");
const authenticationMiddleware = require("../middlewares/authentication");

const PATH = "/user";
const userRoutes = Router();

userRoutes.delete(
  PATH + "/me",
  authenticationMiddleware.authenticateToken,
  userController.delete
);
userRoutes.get(
  PATH,
  authenticationMiddleware.authenticateToken,
  userController.getUsers
);
userRoutes.get(
  PATH + "/:id",
  authenticationMiddleware.authenticateToken,
  userController.getUserById
);
userRoutes.post(PATH, userController.create);

module.exports = userRoutes;
