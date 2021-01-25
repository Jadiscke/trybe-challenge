const jwt = require("jsonwebtoken");

class Authentication {
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.AUTHENTICATION_SECRET, {
      expiresIn: 1800,
    });
  }

  decipherToken(token) {
    return jwt.verify(token, process.env.AUTHENTICATION_SECRET);
  }
}

module.exports = new Authentication();
