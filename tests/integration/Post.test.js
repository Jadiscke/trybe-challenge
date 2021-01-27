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

      console.log();

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
      console.log(response.body);
      assert.deepStrictEqual(response.status, 200);
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
