import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const otherUsers = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      otherUsers,
    });
  } catch (error) {
    console.log("Error in getUsers Controller: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { id: ReceiverId } = req.params;
    const senderId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: senderId, receiverId: ReceiverId },
        { senderId: ReceiverId, receiverId: senderId },
      ],
    });

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.log("Error in getMessages Controller: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, imageUrl } = req.body;
    const { id: receiverId } = req.params;
    const userId = req.user._id;

    console.log("image url: ",imageUrl);

    const newMessage = new Message({
      receiverId: receiverId,
      senderId: userId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage Controller: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
