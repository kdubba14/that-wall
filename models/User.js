const Sequelize = require("sequelize");
const db = require("../db");

const User = db.define(
  "user",
  {
    userID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    alias: {
      type: Sequelize.STRING
    },
    color: {
      type: Sequelize.STRING,
      defaultValue: "#f00"
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    paranoid: true
  }
);

module.exports = User;
