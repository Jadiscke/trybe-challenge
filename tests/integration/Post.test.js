process.env.NODE_ENV = "test";
const env = require("../../src/env");
const { assert } = require("chai");
const request = require("supertest");
const db = require("../../src/db");
const { seedPost, SEEDED_POST } = require("../seeds/post.seed");
const { seedUser, SEEDED_USER } = require("../seeds/user.seed");
const app = require("./../../src/app");
const { generateToken } = require("../../src/Authentication");
const Post = require("../../src/models/Post");
const User = require("../../src/models/User");
const Utils = require("../../src/Utils");
const { Op } = require("sequelize");

describe("POST", async () => {
  before(async () => {
    const { id } = await seedUser();
    await seedPost(id);
  });

  describe("GET /post", async () => {
    it("should return a list of posts", async () => {
      const foundPosts = await Post.findAll({ include: User });
      const foundPostsValues = foundPosts.map((post) => {
        return { ...post.dataValues, user: post.user.dataValues };
      });

      const expected = Utils.formatPostList(foundPostsValues);
      const { id } = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const token = generateToken(id);
      const response = await request(app)
        .get("/post")
        .set("Authorization", `Bearer ${token}`);

      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(
        response.body.map((post) => ({ id: post.id, title: post.title })),
        expected.map((post) => ({ id: post.id, title: post.title }))
      );
    });
  });
  describe("GET /post/:id", async () => {
    it("should return a post by the id", async () => {
      const newPost = {
        title: "new post",
        content: "this is a new post",
      };
      const now = new Date(Date.now()).toISOString();
      const user = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const { id: userId } = user;
      const { id: postId } = await Post.create({
        ...newPost,
        userId,
        published: now,
        updated: now,
      });

      const token = generateToken(userId);
      const expected = {
        id: postId,
        ...newPost,
        user: Utils.formatUser(user.dataValues),
        published: now,
        updated: now,
      };

      const response = await request(app)
        .get(`/post/${postId}`)
        .set("Authorization", `Bearer ${token}`);

      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(response.body, expected);
    });
  });

  describe("GET /post/search?q=:searchTerm", async () => {
    it("should return an array of posts based on the searchTerm", async () => {
      const newPost = {
        title: "Vem que vem",
        content: "A trybe é a melhor escola de programação do planeta!",
      };
      const searchTerm = "escola";
      const now = new Date(Date.now()).toISOString();
      const user = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const post = await Post.create({
        ...newPost,
        userId: user.id,
        published: now,
        updated: now,
      });
      const foundPosts = await Post.findAll({
        include: User,
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

      const expected = Utils.formatPostList(foundPostsValues);
      const { id } = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const token = generateToken(id);
      const response = await request(app)
        .get("/post/search")
        .query(`q=${searchTerm}`)
        .set("Authorization", `Bearer ${token}`);

      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(
        response.body.map((post) => ({ id: post.id, title: post.title })),
        expected.map((post) => ({ id: post.id, title: post.title }))
      );
    });
  });

  describe("PUT /post/:id", async () => {
    it("should update post by id", async () => {
      const newPost = {
        title: "new post",
        content: "this is a new post",
      };
      const now = new Date(Date.now()).toISOString();
      const user = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const { id: userId } = user;
      const { id: postId } = await Post.create({
        ...newPost,
        userId,
        published: now,
        updated: now,
      });

      const updatedPost = {
        ...newPost,
        content: "this is a updated content",
      };

      const token = generateToken(userId);
      const expected = {
        ...updatedPost,
        userId,
      };

      const response = await request(app)
        .put(`/post/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedPost);
      assert.deepStrictEqual(response.status, 200);
      assert.deepStrictEqual(response.body, expected);
    });

    it("should refuse to update because the user is not authorized", async () => {
      const newPost = {
        title: "new post",
        content: "this is a new post",
      };
      const now = new Date(Date.now()).toISOString();
      const user = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const anotherUser = await User.create({
        ...SEEDED_USER,
        email: "notauthorized@email.com",
      });
      const { id: userId } = user;
      const { id: postId } = await Post.create({
        ...newPost,
        userId,
        published: now,
        updated: now,
      });

      const updatedPost = {
        ...newPost,
        content: "this is a updated content",
      };

      const token = generateToken(anotherUser.id);
      const expected = {
        message: "Usuário não autorizado",
      };

      const response = await request(app)
        .put(`/post/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedPost);
      assert.deepStrictEqual(response.status, 401);
      assert.deepStrictEqual(response.body, expected);
    });
  });

  describe("DELETE /post/:id", async () => {
    it("should delete a post by id", async () => {
      const newPost = {
        title: "new post",
        content: "this is a new post",
      };
      const now = new Date(Date.now()).toISOString();
      const { id: userId } = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const { id: postId } = await Post.create({
        ...newPost,
        userId,
        published: now,
        updated: now,
      });

      const token = generateToken(userId);

      const response = await request(app)
        .delete(`/post/${postId}`)
        .set("Authorization", `Bearer ${token}`);
      const foundPost = await Post.findOne({ where: { id: postId } });
      assert.deepStrictEqual(response.status, 204);
      assert.isNull(foundPost);
    });
    it("should refuse to delete because the user is not authorized", async () => {
      const newPost = {
        title: "new post",
        content: "this is a new post",
      };
      const now = new Date(Date.now()).toISOString();
      const user = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const anotherUser = await User.create({
        ...SEEDED_USER,
        email: "notauthorized@email.com",
      });
      const { id: userId } = user;
      const { id: postId } = await Post.create({
        ...newPost,
        userId,
        published: now,
        updated: now,
      });

      const token = generateToken(anotherUser.id);
      const expected = {
        message: "Usuário não autorizado",
      };

      const response = await request(app)
        .delete(`/post/${postId}`)
        .set("Authorization", `Bearer ${token}`);
      const foundPost = await Post.findOne({ where: { id: postId } });
      assert.deepStrictEqual(response.status, 401);
      assert.deepStrictEqual(response.body, expected);
      assert.isNotNull(foundPost);
    });
    it("should fail to delete if post does not exist", async () => {
      const expected = {
        message: "Post não existe",
      };
      const newPost = {
        title: "new post",
        content: "this is a new post",
      };
      const now = new Date(Date.now()).toISOString();
      const { id: userId } = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const post = await Post.create({
        ...newPost,
        userId,
        published: now,
        updated: now,
      });
      const { id: postId } = post;
      await post.destroy();
      const token = generateToken(userId);

      const response = await request(app)
        .delete(`/post/${postId}`)
        .set("Authorization", `Bearer ${token}`);
      const foundPost = await Post.findOne({ where: { id: postId } });
      assert.deepStrictEqual(response.status, 404);
      assert.deepStrictEqual(response.body, expected);
    });
  });
  describe("POST /post", async () => {
    it("should create a new post", async () => {
      const newPost = {
        title: "Latest updates, August 1st",
        content: "The whole text for the blog post goes here in this key",
      };
      const foundUser = await User.findOne({
        where: { email: SEEDED_USER.email },
      });

      const expected = {
        ...newPost,
        userId: foundUser.id,
      };

      const token = generateToken(foundUser.id);

      const response = await request(app)
        .post("/post")
        .set("Authorization", `Bearer ${token}`)
        .send(newPost);

      assert.deepStrictEqual(response.status, 201);
      assert.deepStrictEqual(response.body, expected);
    });
  });
});
