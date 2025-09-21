const asyncHandler = require("express-async-handler");
const messageModel = require("../models/messageModel")
const userModel = require("../models/userModel")
const chatModel = require("../models/chatModel")

const sendMessage = asyncHandler(async  (req,res) => {

    const {  content,chatId } = req.body

    if(!content || !chatId) {
        console.log("Invalid data passed into req ! ")
        return res
          .status(400)
          .json({ message: "Content and chatId are required" });

    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        
        var message = await messageModel.create(newMessage)

        message = await message.populate("sender","name pic")
        message = await message.populate("chat")
        message = await userModel.populate(message,{
            path: 'chat.users',
            select: "name pic email",

        })

        await chatModel.findByIdAndUpdate(req.body.chatId, {
          latestMessage: message,
        });

        res.json(message)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const allMessages = asyncHandler(async  (req,res) => {

    try {
        const messages = await messageModel.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat")

        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

})

module.exports = { sendMessage,allMessages };