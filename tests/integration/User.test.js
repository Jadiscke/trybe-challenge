process.env.NODE_ENV = "test";
const env = require("../../src/env");
const chai = require("chai");
const { assert } = require("chai");
const request = require("supertest");
const db = require("../../src/db");
const { seedUser, SEEDED_USER } = require("../seeds/user.seed");
const app = require("./../../src/app");

describe(" User ", async () => {
  beforeEach(async () => {
    await seedUser();
  });

  describe("GET /users", async () => {
    it("should get a list of users", async () => {
      const response = await request(app).get("/users").type("form");
      assert.deepStrictEqual(response.status, 200);
    });
  });
  describe("POST /users", async () => {
    it("should create a new user and return a token", async () => {
      const newUser = {
        user: "newTestUser",
        password: "123456",
        email: "newemail@example.com",
        displayName: "I am a New Test",
        image: "No image for now",
      };

      const response = await request(app).post("/users").send(newUser);
      assert.deepStrictEqual(response.status, 200);
      console.log(response.body);
      assert.property(response.body, "token");
    });

    it("should fail when trying to create a new user with missing information", async () => {
      const userWithMissingUserName = {
        password: "123456",
        email: "new@email.com",
        displayName: "I am a New Test",
        image: "No image for now",
      };
      const expected = {
        message: '"user" is required',
      };

      const response = await request(app)
        .post("/users")
        .send({ ...userWithMissingUserName });
      console.log("2 - Response: ", response.body);
      assert.deepStrictEqual(response.body, expected);
    });
    it("should fail when trying to create a new user with already registered email", async () => {
      const expected = {
        message: "Usuário já existe",
      };

      const response = await request(app).post("/users").send(SEEDED_USER);

      assert.deepStrictEqual(response.body, expected);
    });
  });
  describe("POST /login", async () => {
    it("should return a token when trying to Login", async () => {
      const seededUser = SEEDED_USER;
      const loginInformation = {
        user: seededUser.user,
        password: seededUser.password,
      };
      const response = await request(app).post("/login").send(loginInformation);
      assert.property(response.body, "token");
    });
  });
});
