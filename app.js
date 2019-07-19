const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const User = require("./models/User");
const Post = require("./models/Post");

const signupConfirmRoute = require("./routes/signupConfirm");
const loginRoute = require("./routes/login");
const postsRoute = require("./routes/posts");
const updateUserRoute = require("./routes/updateUser");

db.authenticate()
  .then(() => {
    console.log("PostgreSQL connected.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

// FOR Cross-Origin
app.use(cors({ exposedHeaders: ["that_wall_auth"] }));
// FOR Body Parsing
app.use(express.json());

// Sequelize Associations
User.hasMany(Post, { foreignKey: "authorId", onDelete: "CASCADE" });

Post.belongsTo(User, { foreignKey: "authorId" });

// ROUTES
app.use("/api/signup", signupConfirmRoute);
app.use("/api/login", loginRoute);
app.use("/api/posts", postsRoute);
app.use("/api/update", updateUserRoute);

db.sync().then(() => {});
app.listen(7070);

process.on("exit", () => {
  db.close();
});

module.exports = app;
