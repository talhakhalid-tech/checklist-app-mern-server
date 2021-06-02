const mongoose = require("mongoose");
const config = require("../config/key");
const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const checklistUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: 18,
    },
  },
  { timestamps: true }
);

checklistUserSchema.statics.userCredentials = async (email, password) => {
  const user = await ChecklistUser.findOne({ email });

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const passwordMatched = await compare(password, user.password);

  if (!passwordMatched) {
    throw new Error("Invalid Credentials");
  }

  return user;
};

checklistUserSchema.methods.createAuthToken = async function () {
  const token = await sign(
    { _id: this._id, email: this.email, name: this.name },
    config.jwtKey
  );
  return token;
};

const ChecklistUser = mongoose.model("ChecklistUser", checklistUserSchema);

module.exports = ChecklistUser;
