const PostModel = require("../models/Post");
const UserModel = require("../models/User");
const Utils = require("../Utils");

class PostController {
  async getPosts(req, res) {
    try {
      const foundPosts = await PostModel.findAll({ include: UserModel });
      const foundPostsValues = foundPosts.map((post) => {
        return { ...post.dataValues, user: post.user.dataValues };
      });

      const formattedPosts = Utils.formatPostList(foundPostsValues);

      return res.status(200).json(formattedPosts);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  async create(req, res) {
    const { id } = req.user;
    const { title, content } = req.body;
    try {
      const { valid, message } = Utils.validatePostInformation({
        title,
        content,
      });

      if (!valid) {
        return res.status(400).json({ message });
      }
      const now = new Date(Date.now()).toISOString();
      const createdPost = await PostModel.create({
        title,
        content,
        userId: id,
        published: now,
        updated: now,
      });

      return res.status(201).json({
        title,
        content,
        userId: id,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error,
      });
    }
  }
}

module.exports = new PostController();
