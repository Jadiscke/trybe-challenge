const routes = require("./routes/index.routes");
const express = require("express");
const db = require("./db");
const env = require("./env");

class App {
  constructor() {
    this.init();
  }
  init() {
    this.app = express();
    this.app.use(routes);
    this.app.use(express.json());
  }
}

module.exports = new App().app;
