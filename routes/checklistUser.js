const express = require("express");
const Router = express.Router();
const { hash } = require("bcryptjs");
const ChecklistUser = require("../models/ChecklistUser");

Router.post("/register", async (req, res) => {
  try {
    let { name, email, password, age } = req.body;

    const isEmailDuplicated = await ChecklistUser.findOne({ email });

    if (isEmailDuplicated) {
      res.status(409).json({ error: "Email Already Exists" });
    }

    password = await hash(password, 8);

    const user = new ChecklistUser({ name, email, password, age });

    await user.save();

    res.status(201).json({
      message: "User Successfully Registered",
      userId: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
});

Router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await ChecklistUser.userCredentials(email, password);
    const token = await user.createAuthToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: "Invalid Credentials" });
  }
});

module.exports = Router;
