const Sequelize = require("sequelize");
const { Model } = require("sequelize");
const { v4 } = require("uuid");

class User extends Model {
  static init(connection) {
    super.init(
      {
        password: Sequelize.STRING,
        email: Sequelize.STRING,
        displayName: Sequelize.STRING,
        image: Sequelize.STRING,
      },
      { sequelize: connection, timestamps: false, modelName: "user" }
    );
    this.addHook("beforeSave", (user) => {
      user.id = v4();
      return user.id;
    });

    return this;
  }
}

module.exports = User;
