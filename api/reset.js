const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const isEmail = require("validator/lib/isEmail");
const baseUrl = require("../utils/baseUrl");
const options = {
  auth: {
    api_key: process.env.sendGrid_api,
  },
};

const transporter = nodemailer.createTransport(sendGridTransport(options));

// check user and send email
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!isEmail(email)) {
      return res.status(401).send("Invalid email address");
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).send("user not found");
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.expireToken = Date.now() + 3600000; // one hour

    await user.save();
    const href = `${baseUrl}/reset/${token}`;
    const mailOptions = {
      to: user.email,
      from: "x19600firehs@gmail.com",
      subject: "Hi there! Password reset request",
      html: `<p>Hey ${user.name
        .split(" ")[0]
        .toString()}, There was a request for password reset. <a href=${href}> Click this link to reset your password. </a>></p>
      <p>This token is valid for only 1 hour.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      err && console.log(err);
    });

    return res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).sendGridTransport("Server Error");
  }
});

// verify token and reset password in DB
router.post("/token", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    if (password.length < 6) {
      return res.status(401).send("password must be at least 6 characters");
    }
    const user = await UserModel.findOne({ resetToken: token });

    if (!user) {
      return res.status(404).send("user not found");
    }

    if (Date.now() > user.expireToken) {
      return res.status(401).send("Token expired. Generating new token");
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = "";
    user.expireToken = undefined;
    await user.save();

    return res.status(200).send("password updated");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
