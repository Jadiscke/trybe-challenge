process.env.NODE_ENV = "test";
const env = require("../../src/env");
const chai = require("chai");
const { assert } = require("chai");
const chaiHttp = require("chai-http");
const db = require("../../src/db");
const seedUser = require("../seeds/user.seed");
const app = require("./../../src/app");

chai.use(chaiHttp);
let seededUser;

describe(" User ", async () => {
  before(async () => {
    seededUser = await seedUser();
  });

  describe("GET /users", () => {
    it("should get a list of users", () => {
      chai
        .request(app)
        .get("/users")
        .end((err, res) => {
          assert.deepStrictEqual(res.status, 200);
        });
    });
  });
  describe("POST /users", () => {
    it("should create a new user", () => {
      const newUser = {
        user: "newTestUser",
        password: "pass",
        email: "new@email.com",
        displayName: "I am a New Test",
        image: "No image for now",
      };

      chai
        .request(app)
        .post("/users")
        .send(newUser)
        .end((err, res) => {
          assert.property(res.body, id);
        });
    });

    it("should fail when trying to create a new user with missing information", () => {
      const userWithMissingUserName = {
        password: "pass",
        email: "new@email.com",
        displayName: "I am a New Test",
        image: "No image for now",
      };
      const expected = {
        message: '"user" is required',
      };

      chai
        .request(app)
        .post("/users")
        .send(userWithMissingUserName)
        .end((err, res) => {
          assert.deepStrictEqual(res.body, expected);
        });
    });
    it("should fail when trying to create a new user with already registered email", () => {
      const expected = {
        message: "Usuário já existe",
      };

      const userAlreadyRegistered = seededUser;

      chai
        .request(app)
        .post("/users")
        .send(userAlreadyRegistered)
        .end((err, res) => {
          assert.deepStrictEqual(res.body, expected);
        });
    });
  });
});
