// controllers/chatControllers.js
const asyncHandler = require("express-async-handler");
const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

// ---------- access single / create chat ----------
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with req");
    return res.status(400);
  }

  let isChat = await chatModel
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) return res.send(isChat[0]);

  try {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await chatModel.create(chatData);
    const fullChat = await chatModel
      .findOne({ _id: createdChat._id })
      .populate("users", "-password");

    res.status(200).send(fullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// ---------- fetch all chats ----------
const fetchChat = asyncHandler(async (req, res) => {
  try {
    let results = await chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    results = await userModel.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// ---------- group chat controllers ----------
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required for a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await chatModel.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await chatModel
    .findByIdAndUpdate(chatId, { chatName }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const addedUser = await chatModel
    .findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addedUser) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(addedUser);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removedUser = await chatModel
    .findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removedUser) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(removedUser);
  }
});

// ---------- export ----------
module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
