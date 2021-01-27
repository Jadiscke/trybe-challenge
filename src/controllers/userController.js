const UserModel = require("../models/User");
const { generateToken } = require("../Authentication");
const Utils = require("../Utils");

class UserController {
  constructor() {}
  async findUserWithEmail(email) {
    const user = await UserModel.findOne({ where: { email: email } });

    return user;
  }

  async create(req, res) {
    try {
      const {
        valid: isDefined,
        undefinedKeys,
      } = Utils.validateIfUserEntriesAreDefined(req.body);
      if (!isDefined) {
        return res
          .status(400)
          .json({ message: `"${undefinedKeys[0]}" is required` });
      }
      const { password, email, image, displayName } = req.body;
      if (!Utils.validateDisplayName(displayName)) {
        return res.status(400).json({
          message: ' "displayName" lenght must be at least 8 characters long',
        });
      }
      if (!Utils.validateEmail(email)) {
        return res.status(400).json({
          message: ' "email" must be a valid e-mail',
        });
      }

      const isPasswordValid = Utils.validatePasswordLenght(password);

      if (!isPasswordValid) {
        return res.status(400).json({
          message: ' "password" length must be 6 characters long ',
        });
      }

      const foundUser = await UserController.prototype.findUserWithEmail(email);
      if (foundUser) {
        return res.status(409).json({
          message: "Usuário já existe",
        });
      }
      const { id } = await UserModel.create({
        password,
        email,
        image,
        displayName,
      });
      const token = generateToken(id);
      console.log("Token", token);
      return res.status(200).json({ token: token });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error });
    }
  }

  async delete(req, res) {
    const { id } = req.user;

    try {
      const response = await UserModel.destroy({
        where: {
          id: id,
        },
      });

      console.log("response");

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      const usersToSend = Utils.formatUserList(users);
      return res.json(usersToSend);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await UserModel.findOne({ where: { id: id } });
      if (!user) {
        return res.status(404).json({ message: "Usuário não existe" });
      }
      const formatedUser = Utils.formatUser(user);
      return res.status(200).json(formatedUser);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { valid, message } = Utils.validateLoginInformation({
        email,
        password,
      });

      if (!valid) {
        return res.status(400).send({ message });
      }

      const userFound = await UserModel.findOne({
        where: {
          email: email,
        },
      });

      if (!userFound || userFound.password !== password) {
        res.status(400).json({
          message: "Campos inválidos!",
        });
      }

      const token = generateToken(userFound.id);

      return res.status(200).json({
        token,
      });
    } catch (error) {
      return res.status(401).send();
    }
  }
}

module.exports = new UserController();
