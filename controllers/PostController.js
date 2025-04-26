import asyncHandler from "express-async-handler";
import Post from "../models/BlogPost.js";
import { data } from "../data/importData.js";
import PostContent from "../models/PostContent.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Like from "../models/Like.js";

// @desc  Get all posts
// @route GET /api/posts
// @access Public

export const getPosts = asyncHandler(async (req, res) => {
  let { page = 1, limit = 4 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const posts = await Post.find()
    .sort({ createdAt: -1 }) // Sort by newest posts first
    .skip((page - 1) * limit) // Skip previous pages' posts
    .limit(limit); // Limit results

  const totalPosts = await Post.countDocuments(); // Total posts count

  res.json({
    posts,
    hasMore: page * limit < totalPosts, // True if more posts are available
  });
});

// @desc get a single post
// @route GET /api/posts/:id
// @access Public

export const getPostById = asyncHandler(async (req, res) => {
  const id = req.body.id;

  const post = await Post.findById(id);

  res.json(post);
});

// @desc get single post content
// @route GET /api/posts/content/:id
// @access Public

export const getPostContentById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const _userId = req.user.userId;

  console.log("User ID:", _userId);
  console.log("Post ID:", id);

  let liked = false;

  if (mongoose.Types.ObjectId.isValid(_userId)) {
    const userLikedPost = await Like.findOne({ 
      userId: _userId, 
      postId: id, 
    });
    if (userLikedPost != null) liked = true;
  }

  const postContent = await PostContent.findOne({ postId: id });

  res.json({ content: postContent, liked: liked });
});

// @desc delete a post
// @route DELETE /api/posts/:id
// @access Public

export const deletePostById = asyncHandler(async (req, res) => {
  const id = req.body.id;

  const deletedPost = await Post.deleteOne({ _id: id });

  res.json({
    message: "Post has been deleted successfully.",
    post: deletedPost,
  });
});

// @desc create a post and its content
// @route POST /api/posts/create
// @access Public

export const createPost = asyncHandler(async (req, res) => {
  const {
    PostType,
    PostLenght,
    PostTitle,
    PostDescription,
    PostImage,
    PostContentText,
    PostAuthor,
    PostAuthorId,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction(); // Start a transaction

  try {
    const post = await Post.create(
      [
        {
          PostType,
          PostLenght,
          PostTitle,
          PostDescription,
          PostImage,
          PostContentText,
          PostAuthor,
          PostAuthorId,
        },
      ],
      { session }
    );

    const postContent = await PostContent.create(
      [
        {
          postId: post[0]._id,
          content: PostContentText,
        },
      ],
      { session }
    );

    const userPostsUpdate = await User.findByIdAndUpdate(
      PostAuthorId,
      { $push: { posts: [post[0]._id] } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    console.log("Post and PostContent created successfully!");

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    res.status(500).json({
      error: "Internal server error, ismaeil",
      details: error.message,
    });
  }
});

// @desc delete post
// @route DELETE /api/posts/delete/:id
// @access Public

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedPost = await Post.findByIdAndDelete(id, { session });

    if (!deletedPost) {
      throw new Error("Post not found");
    }

    const deletedPostContent = await PostContent.deleteOne(
      { postId: id },
      { session }
    );

    if (deletedPostContent.deletedCount === 0) {
      throw new Error("Post content not found");
    }

    const removePostIdFromUser = await User.findByIdAndUpdate(
      deletedPost.PostAuthorId,
      { $pull: { posts: id } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Post and its content deleted successfully",
      post: deletedPost,
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
});

// ! this is just a route to post all data to the database

export const importTestPosts = asyncHandler(async (req, res) => {
  const sentPosts = await Post.create(data);
  res.json({ message: "Posts have been added", data: sentPosts });
});
