const UserModel = require("../models/User");
const Utils = require("../Utils");
class UserController {
  constructor() {}

  async getUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      const usersToSend = Utils.formatUserList(users);
      return res.json(usersToSend);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
  async findUserByName() {}

  async findUserByEmail() {}
  

  async;
  async create(req, res) {
    const { user, password, email, image, displayName } = req.body;
    
    try {
      const {valid: isDefined, undefinedKeys } = Utils.validateIfUserEntriesAreDefined(req.body);
      if (!isDefined){
        return res.status(400).json({ message : `"${undefinedKeys[0]}" is required`})
      }
      if (!Utils.validateDisplayName(displayName)){
        return res.status(400).json({
          message: " \"displayName\" lenght must be at least 8 characters long"
        })
      }
      if (!Utils.validateEmail){
        return res.status(400).json({
          message: " \"email\" must be a valid e-mail"
        })
      }
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
