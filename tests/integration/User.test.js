process.env.NODE_ENV = "test";
const env = require("../../src/env");
const { assert } = require("chai");
const request = require("supertest");
const db = require("../../src/db");
const { seedUser, SEEDED_USER } = require("../seeds/user.seed");
const app = require("./../../src/app");
const User = require("../../src/models/User");
const { generateToken } = require("../../src/Authentication");

const sinon = require("sinon");
const BIG_TIME = 180000000;
var clock;

describe(" User ", async () => {
  before(async () => {
    clock = sinon.useFakeTimers();
    await seedUser();
  });

  after(() => {
    clock.restore();
  });

  describe("GET /user", async () => {
    it("should get a list of user", async () => {
      const foundUser = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const token = generateToken(foundUser.id);
      const response = await request(app)
        .get("/user")
        .type("form")
        .set("Authorization", `Bearer ${token}`);
      assert.deepStrictEqual(response.status, 200);
    });

    it("should fail to get a list of user when token is missing", async () => {
      const response = await request(app).get("/user").type("form");
      assert.deepStrictEqual(response.status, 401);
    });
    it("should fail to get a list of users when token is invalid", async () => {
      const expected = {
        message: "Token não encontrado",
      };
      const response = await request(app)
        .get("/user")
        .type("form")
        .set("Authorization", "Bearer 123456");
      assert.deepStrictEqual(response.status, 401);
      assert.deepStrictEqual(response.body, expected);
    });
    it("should fail to get a list of users when token is expired", async () => {
      const expected = {
        message: "Token expirado ou inválido",
      };
      const foundUser = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const token = generateToken(foundUser.id);
      clock.tick(BIG_TIME);
      const response = await request(app)
        .get("/user")
        .type("form")
        .set("Authorization", `Bearer ${token}`);
      assert.deepStrictEqual(response.status, 401);
      assert.deepStrictEqual(response.body, expected);
    });
  });
  describe("GET /user/:id", async () => {
    it("should return a user by id", async () => {
      const { id } = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const token = generateToken(id);
      const expected = {
        id,
        displayName: SEEDED_USER.displayName,
        email: SEEDED_USER.email,
        image: SEEDED_USER.image,
      };
      const response = await request(app)
        .get(`/user/${id}`)
        .set("Authorization", `Bearer ${token}`);

      assert.deepStrictEqual(response.body, expected);
    });
    it("should return a user status 404 if user is not found", async () => {
      const { id } = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const invalidId = Math.floor(Math.random() * 100);
      const token = generateToken(id);
      const expected = {
        id,
        displayName: SEEDED_USER.displayName,
        email: SEEDED_USER.email,
        image: SEEDED_USER.image,
      };
      const response = await request(app)
        .get(`/user/${invalidId}`)
        .set("Authorization", `Bearer ${token}`);

      assert.deepStrictEqual(response.status, 404);
    });

    it("should return status 401 if token is not valid", async () => {
      const { id } = await User.findOne({
        where: { email: SEEDED_USER.email },
      });
      const token = undefined;
      const expected = {
        message: "Token não encontrado",
      };
      const response = await request(app)
        .get(`/user/${id}`)
        .set("Authorization", `Bearer ${token}`);
      assert.deepStrictEqual(response.status, 401);
      assert.deepStrictEqual(response.body, expected);
    });
  });
  describe("POST /user", async () => {
    it("should create a new user and return a token", async () => {
      const newUser = {
        password: "123456",
        email: "newemail@example.com",
        displayName: "I am a New Test",
        image: "No image for now",
      };

      const response = await request(app).post("/user").send(newUser);
      assert.deepStrictEqual(response.status, 200);

      assert.property(response.body, "token");
    });

    it("should fail when trying to create a new user with missing information", async () => {
      const userWithMissingUserName = {
        password: "123456",
        displayName: "I am a New Test",
        image: "No image for now",
      };
      const expected = {
        message: '"email" is required',
      };

      const response = await request(app)
        .post("/user")
        .send({ ...userWithMissingUserName });
      assert.deepStrictEqual(response.body, expected);
    });
    it("should fail when trying to create a new user with already registered email", async () => {
      const expected = {
        message: "Usuário já existe",
      };

      const response = await request(app).post("/user").send(SEEDED_USER);

      assert.deepStrictEqual(response.body, expected);
    });
  });
  describe("DELETE /user/me", async () => {
    it("should delete my user based on token information", async () => {
      const expectedStatus = 204;

      const { id } = await User.create({
        ...SEEDED_USER,
      });

      const token = generateToken(id);

      const response = await request(app)
        .delete("/user/me")
        .set("Authorization", `Bearer ${token}`);

      const foundUser = await User.findOne({
        where: { id: id },
      });

      assert.deepStrictEqual(response.status, expectedStatus);
      assert.isNull(foundUser);
    });
    it("should fail to delete my user if token information is invalid", async () => {
      const expectedStatus = 401;
      const expected = {
        message: "Token expirado ou inválido",
      };

      const { id } = await User.create({
        ...SEEDED_USER,
      });

      const token = generateToken(id);
      const foundUser = await User.findOne({
        where: { id: id },
      });
      foundUser.destroy();
      const response = await request(app)
        .delete("/user/me")
        .set("Authorization", `Bearer ${token}`);

      assert.deepStrictEqual(response.status, expectedStatus);
      assert.deepStrictEqual(response.body, expected);
    });
    it("should fail to delete my user if token information is expired", async () => {
      const expectedStatus = 401;
      const expected = {
        message: "Token expirado ou inválido",
      };

      const { id } = await User.create({
        ...SEEDED_USER,
      });

      const token = generateToken(id);

      clock.tick(BIG_TIME);

      const response = await request(app)
        .delete("/user/me")
        .set("Authorization", `Bearer ${token}`);

      const foundUser = await User.findOne({
        where: { id: id },
      });
      assert.deepStrictEqual(response.status, expectedStatus);
      assert.deepStrictEqual(response.body, expected);
      assert.isNotNull(foundUser);

      foundUser.destroy();
    });
  });
  describe("POST /login", async () => {
    it("should return a token when trying to Login", async () => {
      const seededUser = SEEDED_USER;
      const loginInformation = {
        email: seededUser.email,
        password: seededUser.password,
      };
      const response = await request(app).post("/login").send(loginInformation);
      assert.property(response.body, "token");
    });

    it("should fail whent trying to login with missing information", async () => {
      const expected = {
        message: '"email" is required',
      };
      const seededUser = SEEDED_USER;
      const loginInformation = {
        password: seededUser.password,
      };

      const response = await request(app).post("/login").send(loginInformation);
      assert.deepStrictEqual(response.status, 400);
      assert.deepStrictEqual(response.body, expected);
    });

    it("should fail whent trying to login with wrong information", async () => {
      const expected = {
        message: "Campos inválidos!",
      };
      const seededUser = SEEDED_USER;
      const loginInformation = {
        email: seededUser.email,
        password: "674512",
      };

      const response = await request(app).post("/login").send(loginInformation);
      assert.deepStrictEqual(response.status, 400);
      assert.deepStrictEqual(response.body, expected);
    });
  });
});
