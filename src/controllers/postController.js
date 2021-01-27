const { Op } = require("sequelize");
const PostModel = require("../models/Post");
const UserModel = require("../models/User");
const Utils = require("../Utils");

class PostController {
  async getAll(req, res) {
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

  async getById(req, res) {
    const { id } = req.params;

    try {
      const foundPost = await PostModel.findOne({
        include: [{ all: true }],
        where: {
          id,
        },
      });
      if (!foundPost) {
        return res.status(404).json({
          message: "Post não existe",
        });
      }
      const foundPostValues = {
        ...foundPost.dataValues,
        user: foundPost.user.dataValues,
      };
      const formatedPost = Utils.formatPost(foundPostValues);

      return res.status(200).json(formatedPost);
    } catch (error) {
      return res.status(400).json(error);
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
      return res.status(400).json({
        error,
      });
    }
  }

  async updateById(req, res) {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { title, content } = req.body;

    try {
      const { valid, message } = Utils.validatePostInformation({
        title,
        content,
      });
      if (!valid) {
        return res.status(400).json(message);
      }
      const post = await PostModel.findOne({ where: { id } });
      if (!post) {
        return res.status(404).send();
      }

      if (post.userId !== userId) {
        return res.status(401).json({
          message: "Usuário não autorizado",
        });
      }
      const now = new Date(Date.now()).toISOString();

      post.setDataValue("title", title);
      post.setDataValue("content", content);
      post.setDataValue("updated", now);
      await post.save();

      return res.status(200).json({
        title,
        content,
        userId,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async deleteById(req, res) {
    const { id } = req.params;
    const { id: userId } = req.user;
    try {
      const post = await PostModel.findOne({ where: { id } });
      if (!post) {
        return res.status(404).json({
          message: "Post não existe",
        });
      }
      if (post.userId !== userId) {
        return res.status(401).json({
          message: "Usuário não autorizado",
        });
      }

      await post.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json(error);
    }
  }
  async search(req, res) {
    const { q: searchTerm } = req.query;
    try {
      const foundPosts = await PostModel.findAll({
        include: UserModel,
        where: {
          [Op.or]: [
            {
              title: {
                [Op.substring]: searchTerm,
              },
            },
            {
              content: {
                [Op.substring]: searchTerm,
              },
            },
          ],
        },
      });
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
