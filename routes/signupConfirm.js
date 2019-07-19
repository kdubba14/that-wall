const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const axios = require("axios");

router.use(express.json());

// POST /api/signup
// To send email verification
// Initial signup is through middleware
router.post("/", middleware.signup, (req, res) => {
  let successObj = req.body.successObj;

  // EMAIL BODY
  const outputHtml = `
    <h3>It's a wall ... you know what to do!</h3>
    <br />
    <p>Red fish, Blue fish, One fish, Two fish</p>
    <p>Wall gets coded 'cause I do this</p>
    <p>You post on it don't remove it</p>
    <p>That feature wasn't stated on the To-Do list ;)</p>
    <br />
    <h3>P.S.</h3>
    <h2>ACCOUNT ACTIVATED</h2>
  `;

  // EMAIL POST REQUEST URL
  let url = "https://api.sendinblue.com/v3/smtp/email";

  // EMAIL POST REQUEST HEADER
  let mailOptions = {
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.EMAIL_KEY
    }
  };

  // EMAIL DETAIL FORMATION
  let body = JSON.stringify({
    tags: ["test"],
    sender: { email: "info@thatwall.io" },
    htmlContent: outputHtml,
    subject: "THAT WALL Account Activated",
    replyTo: {
      email: "info@thatwall.io",
      name: "That Wall"
    },
    to: [
      {
        email: successObj.email,
        name: "New Member"
      }
    ]
  });

  // POST Sendinblue SMTP
  axios
    .post(url, body, mailOptions)
    .then(emailSuccess => {
      successObj.emailSuccess = true;
      return res.send(successObj);
    })
    .catch(err => {
      return res.send(successObj);
    });
});

module.exports = router;
