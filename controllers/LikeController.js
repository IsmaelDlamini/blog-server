import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Like from "../models/Like.js";
import Post from "../models/BlogPost.js";

// @desc    Toggle a like (create or remove)
// @route   POST /api/likes
// @access  Private
export const toggleLike = asyncHandler(async (req, res) => {
  const { userId, postId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if like already exists
    const existingLike = await Like.findOne({ userId, postId });

    if (existingLike) {
      // Remove like (unlike)
      await Like.deleteOne({ _id: existingLike._id }, { session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({ message: "Like removed" });
    }

    const newLike = await Like.create([{ userId, postId }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Like added", like: newLike[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Like toggle transaction failed:", error);
    res.status(500).json({ message: "Server error toggling like" });
  }
});
