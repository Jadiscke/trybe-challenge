const UserModel = require("../models/User");
const { decipherToken } = require("../Authentication");

class AuthenticationMiddleware {
  async authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader) {
        return res.status(401).json({ message: "Token não encontrado" });
      }
      const token = authHeader && authHeader.split(" ")[1];

      if (token === null) {
        return res.status(401).json({ message: "Token não encontrado" });
      }
      const decipheredInfo = decipherToken(token);
      if (!decipheredInfo)
        return res.status(401).json({ message: "Token não encontrado" });

      const { id } = decipheredInfo;
      const foundUser = await UserModel.findOne({ where: { id } });
      if (!foundUser) {
        return res.status(401).json({ message: "Token não encontrado" });
      }

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expirado ou inválido" });
      }
      return res.status(500).json({ error });
    }
  }
}

module.exports = new AuthenticationMiddleware();
