const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const validator = require("validator");
const User = require("./models/User");

// Token checking middleware
let tokenCheck = (req, res, next) => {
  let token = req.headers["that_wall_auth"];

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.send({
          success: false,
          message: "token is not valid"
        });
      } else {
        req.that_wall_user = decoded;
        next();
      }
    });
  } else {
    return res.send({
      success: false,
      message: "did not recieve token..."
    });
  }
};

// Signup middleware
let signup = async (req, res, next) => {
  let { alias, email, color, password } = req.body;

  // ------ VALIDATION -------
  //ALIAS(basically Username)
  if (/^[a-zA-Z0-9_]*$/.test(alias) === false) {
    return res.send({
      userSuccess: false,
      emailSuccess: false,
      message: "Alias can only contain letters, numbers, and underscores"
    });
  }
  if (/^.{3,}$/.test(alias) === false) {
    return res.send({
      userSuccess: false,
      emailSuccess: false,
      message: "Alias must contain at least 3 characters"
    });
  }
  //EMAIL
  if (validator.isEmail(email) === false) {
    return res.send({
      userSuccess: false,
      emailSuccess: false,
      message: "Please enter valid email"
    });
  }
  //PASSWORD
  if (password.length < 8) {
    return res.send({
      userSuccess: false,
      emailSuccess: false,
      message: "Password must be at least 8 characters"
    });
  }
  if (
    /.*[A-Z]/.test(password) === false ||
    /.*[a-z]/.test(password) === false ||
    /.*[0-9]/.test(password) === false
  ) {
    return res.send({
      userSuccess: false,
      emailSuccess: false,
      message:
        "Password must contain at least one Uppercase letter, Lowercase letter, and Number"
    });
  }

  //CREATION LOGIC POST-VALIDATION
  try {
    let emailExists = await User.findOne({
      where: {
        email: email
      }
    });

    if (emailExists) {
      return res.send({
        userSuccess: false,
        emailSuccess: false,
        message: "An account with that email already exists"
      });
    } else {
      const hash = await argon2.hash(password);

      let newUser = await User.create({
        alias,
        email,
        color,
        password: hash
      });

      let successObj = {
        alias,
        email,
        color,
        id: newUser.userID,
        userSuccess: true,
        emailSuccess: false
      };

      req.body.email = email;
      req.body.successObj = successObj;

      next();
    }
  } catch (error) {
    return res.send({ Error: error });
  }
};

module.exports = {
  tokenCheck: tokenCheck,
  signup: signup
};
