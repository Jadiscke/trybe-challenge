const Sequelize = require("sequelize");
const Post = require("../models/Post");
const User = require("../models/User");
const config = require("./config/config");

const models = [User, Post];
class Database {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(config);
    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate());
  }
}

module.exports = new Database();
