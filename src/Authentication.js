const jwt = require("jsonwebtoken");

class Authentication {
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.AUTHENTICATION_SECRET, {
      expiresIn: 1800,
    });
  }

  decipherToken(token) {
    try {
      const decipheredInfo = jwt.verify(
        token,
        process.env.AUTHENTICATION_SECRET
      );
      return decipheredInfo;
    } catch (error) {
      return undefined;
    }
  }
}

module.exports = new Authentication();
