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

module.exports = postRoutes;
