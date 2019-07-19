const Sequelize = require("sequelize");
const db = require("../db");

const Post = db.define(
  "post",
  {
    postID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    authorId: {
      type: Sequelize.UUID
    },
    content: {
      type: Sequelize.STRING,
      min: 1,
      allowNull: false
    }
  },
  {
    paranoid: true
  }
);

module.exports = Post;
