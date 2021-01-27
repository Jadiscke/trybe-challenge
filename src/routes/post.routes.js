const { Router } = require("express");
const postController = require("../controllers/postController");
const AuthenticationMiddleware = require("../middlewares/authentication");

const PATH = "/post";
const postRoutes = Router();

postRoutes.get(
  PATH,
  AuthenticationMiddleware.authenticateToken,
  postController.getPosts
);

postRoutes.get(
  PATH + "/:id",
  AuthenticationMiddleware.authenticateToken,
  postController.getPostById
);

postRoutes.put(
  PATH + "/:id",
  AuthenticationMiddleware.authenticateToken,
  postController.updatePostById
);

postRoutes.post(
  PATH,
  AuthenticationMiddleware.authenticateToken,
  postController.create
);

module.exports = postRoutes;
