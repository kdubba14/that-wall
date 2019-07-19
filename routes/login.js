const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/User");

router.use(express.json());

// POST /api/login
// To login to an active account
router.post("/", async (req, res) => {
  let { email, password } = req.body;

  //NO WASTED FETCHING IF EMAIL OR PASSWORD INVALID
  if (validator.isEmail(email) === false || password.length < 8) {
    return res.send({
      success: false,
      message: "Incorrect email or password"
    });
  }

  try {
    let user = await User.findOne({
      where: {
        email: email
      }
    });

    if (user) {
      let verifiedPassword = await argon2.verify(user.password, password);

      if (verifiedPassword) {
        let token = jwt.sign(
          {
            userID: user.userID,
            email: user.email
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "2h" }
        );

        return res.send({
          success: true,
          message: "login success!",
          user: {
            userID: user.userID,
            email: user.email,
            alias: user.alias
          },
          token
        });
      }
    }

    return res.send({
      success: false,
      message: "Incorrect email or password"
    });
  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;
