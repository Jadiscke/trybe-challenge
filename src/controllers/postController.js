const PostModel = require("../models/Post");
const UserModel = require("../models/User");
const Utils = require("../Utils");

class PostController {
  async getPosts(req, res) {
    try {
      console.log("ENTREI AQUI!!!!!");
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
}

module.exports = new PostController();
