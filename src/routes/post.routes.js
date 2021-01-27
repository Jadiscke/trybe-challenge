const { Router } = require("express");
const postController = require("../controllers/postController");
const AuthenticationMiddleware = require("../middlewares/authentication");

const PATH = "/post";
const postRoutes = Router();

postRoutes.get(
  PATH,
  AuthenticationMiddleware.authenticateToken,
  postController.getAll
);

postRoutes.get(
  PATH + "/:id",
  AuthenticationMiddleware.authenticateToken,
  postController.getById
);

postRoutes.put(
  PATH + "/:id",
  AuthenticationMiddleware.authenticateToken,
  postController.updateById
);

postRoutes.delete(
  PATH + "/:id",
  AuthenticationMiddleware.authenticateToken,
  postController.deleteById
);

postRoutes.post(
  PATH,
  AuthenticationMiddleware.authenticateToken,
  postController.create
);

module.exports = postRoutes;
