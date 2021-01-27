const Sequelize = require("sequelize");
const { Model } = require("sequelize");
const { v4 } = require("uuid");
const User = require("./User");

class Post extends Model {
  static init(connection) {
    super.init(
      {
        title: Sequelize.STRING,
        content: Sequelize.DataTypes.TEXT,
        userId: Sequelize.STRING,
        published: Sequelize.DataTypes.DATE,
        updated: Sequelize.DataTypes.DATE,
      },
      { sequelize: connection, timestamps: false, modelName: "post" }
    );
    this.addHook("beforeSave", (post) => {
      post.id = v4();
      return post.id;
    });

    return this;
  }
  static associate() {
    this.belongsTo(User, { foreignKey: "userId" });
  }
}

module.exports = Post;
