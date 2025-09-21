// controllers/userControllers.js
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields !");
  }

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists !");
  }

  const userCreated = await userModel.create({
    name,
    email,
    password,
    pic,
  });

  if (userCreated) {
    return res.status(201).json({
      _id: userCreated._id,
      name: userCreated.name,
      email: userCreated.email,
      pic: userCreated.pic,
      token: generateToken(userCreated._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user !");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields !");
  }

  const validEmail = await userModel.findOne({ email });

  if (validEmail && (await validEmail.matchPassword(password))) {
    res.json({
      _id: validEmail._id,
      name: validEmail.name,
      email: validEmail.email,
      pic: validEmail.pic,
      token: generateToken(validEmail._id),
    });
  } else {
    res.status(400);
    throw new Error("Enter proper credentials !");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const usersFound = await userModel
    .find(keyword)
    .find({ _id: { $ne: req.user._id } });

  res.send(usersFound);
});

module.exports = { registerUser, authUser, allUsers };
