const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const User = require("../models/User");

router.use(express.json());

// POST /api/update
// To update user alias
// DIDNT GET TO ADD THIS FEATURE YET
router.post("/", middleware.tokenCheck, async (req, res) => {
  let { alias } = req.body;
  let user = req.that_wall_user;

  // ------ VALIDATION -------
  // ALIAS(basically Username)
  if (/^[a-zA-Z0-9_]*$/.test(alias) === false) {
    return res.send({
      userSuccess: false,
      emailSuccess: false,
      validationError:
        "Alias can only contain letters, numbers, and underscores"
    });
  }
  if (/^.{3,}$/.test(alias) === false) {
    return res.send({
      userSuccess: false,
      emailSuccess: false,
      validationError: "Alias must contain at least 3 characters"
    });
  }

  //CREATION LOGIC POST-VALIDATION
  try {
    let updatedUser = await User.update(
      { alias: alias },
      {
        where: { userID: user.userID },
        returning: true
      }
    );

    return res.send({
      success: true,
      message: "User updated",
      updatedUser: updatedUser
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "How did you get here with no user info?",
      Error: error
    });
  }
});

module.exports = router;
