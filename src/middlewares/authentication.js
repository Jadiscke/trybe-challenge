const UserModel = require("../models/User");
const { decipherToken } = require("../Authentication");

class AuthenticationMiddleware {
  async authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader) {
        return res.status(401).send();
      }
      const token = authHeader && authHeader.split(" ")[1];

      if (token === null) {
        return res.status(401).send();
      }
      const decipheredInfo = decipherToken(token);
      if (!decipheredInfo)
        return res.status(401).json({ message: "Token não encontrado" });

      const { id } = decipheredInfo;
      const foundUser = await UserModel.findOne({ where: { id } });
      if (!foundUser) {
        return res.status(401).send();
      }

      next();
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

module.exports = new AuthenticationMiddleware();
