import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const authController = {
  signUp: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(401).json({
          success: false,
          message: "Invalid Credentials",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password Must be more than 6 letters",
        });
      }

      const user = await User.findOne({ email });
      if (user) {
        return res.status(409).json({
          success: false,
          message: "User already Exist",
        });
      }
      const user1 = await User.findOne({ username });
      if (user1) {
        return res.status(409).json({
          success: false,
          message: "Username already Exist",
        });
      }

      const hashPass = await bcrypt.hash(password, 12);

      const newUser = new User({ username, email, password: hashPass });

      if (newUser) {
        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
          _id: newUser._id,
          username: newUser.username,
          profilePic: newUser.profilePic,
          email: newUser.email,
          success: true,
          message: " User created successfully",
        });
      } else {
        return res
          .status(422)
          .json({ success: false, message: "Invalid Credentials" });
      }
    } catch (error) {
      console.log("error in signup: ", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  logout: (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
      });
    } catch (error) {
      console.error("Log Out problem at controller 76", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(403).json({
          success: false,
          message: "Invalid Credentials",
        });
      }

      const isPass = await bcrypt.compare(password, user.password);

      if (isPass) {
        generateToken(user._id, res);
        res.status(200).json({
          success: true,
          message: "Logged In Successfully",
          User: {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
          },
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "Invalid Credentials",
        });
      }
    } catch (error) {
      console.log("Error in login: ", error);
      res.status(500).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  },
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userID = req.user._id;

    if (!profilePic) {
      return res.status(401).json({
        success: false,
        message: "Invalid Photo",
      });
    }
    const cloudRes = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { profilePic: cloudRes.secure_url },
      { new: true }
    );

    res.status(200).json({
      user: updatedUser,
      success: true,
      message: "Profile Picture Uploaded",
    });
  } catch (error) {
    console.log("Error in upload Profile Pic: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default authController;
