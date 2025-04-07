import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @desc register user
// @route GET /api/users/register
// @access Public

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

    // Set cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only over HTTPS in production
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      // Send response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
});

// @desc login user
// @route GET /api/users/register
// @access Public

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check it the user exists

  const existingUser = await User.findOne({ email: email });

  if (!existingUser) {
    return res.status(400).json({
      message: "User does not exist",
    });
  }

  // check if the password is correct

  const passwordsMatch = await bcrypt.compare(password, existingUser.password);

  if (passwordsMatch) {
    
    const token = jwt.sign(
        { userId: existingUser._id, username: existingUser.name },
        process.env.SECRET_KEY || "1234!@#%<{*&)",
        { expiresIn: "7d" }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    
    res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } else {
    // if the password is incorrect, return error
    return res.status(400).json({
      message: "Incorrect password or email",
    });
  }

});


export const fetchUserInfo = asyncHandler(async (req, res) => {

    const userId = req.user.userId; 
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await User.findById(userId).select("-password"); // Exclude password from the response
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);

})


// @desc logout user
// @route GET /api/users/logout
// @access Public


export const logout = asyncHandler(async (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "None", // Adjust based on your needs
        path: "/",
      });
    res.status(200).json({ message: "User logged out successfully" });

})


// @desc logout user
// @route GET /api/users/
// @access Public

export const getAllUsers = asyncHandler(async (req, res) => {

  const allUsers = await User.find({});

  res.json({
      message: "successfully fetched all users",
      users: allUsers,
  })
  
})


// @desc delete user
// @route GET /api/users/delete/:id
// @access Public


export const deleteUser = asyncHandler(async (req, res) => {

  const id = req.params.id;
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const deletedUser = await User.findByIdAndDelete(id, {session} );

    //const deletedUserPosts = deletedUser.posts;

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "user and their content deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
  
})







