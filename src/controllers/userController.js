const UserModel = require("../models/User");

class UserController {
  constructor() {}

  async getUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      return res.json(users);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
  async create(req, res) {
    const { user, password, email, image, displayName } = req.body;

    try {
      const id = await UserModel.create({
        user,
        password,
        email,
        image,
        displayName,
      });
      return res.json({ id });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error });
    }
  }
}

module.exports = new UserController();
