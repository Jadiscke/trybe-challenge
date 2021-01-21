const Sequelize = require("sequelize");
const { Model } = require("sequelize");
const { uuid } = require("uuidv4");

class User extends Model {
  static init(connection) {
    super.init(
      {
        user: Sequelize.STRING,
        password: Sequelize.STRING,
        email: Sequelize.STRING,
        displayName: Sequelize.STRING,
        image: Sequelize.STRING,
      },
      { sequelize: connection, timestamps: false, modelName: "user" }
    );
    this.addHook("beforeSave", async (user) => {
      return (user.id = uuid());
    });
    return this;
  }
}

module.exports = User;
