const routes = require("./routes/index.routes");
const cors = require("cors");
const express = require("express");
const db = require("./db");
const env = require("./env");

class App {
  constructor() {
    this.init();
  }
  init() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(routes);
  }
}

module.exports = new App().app;
