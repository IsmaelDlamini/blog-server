import asyncHandler from "express-async-handler";
import Post from "../models/BlogPost.js";
import { data } from "../data/importData.js";

// @desc  Get all posts
// @route GET /api/posts
// @access Public

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});
  res.json(posts);
});

// @desc get a single post
// @route GET /api/posts/:id
// @access Public

export const getPostById = asyncHandler(async (req, res) => {
  const id = req.body.id;

  const post = await Post.FindById(id);

  res.json(post);
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

// ! this is just a route to post all data to the database

export const importTestPosts = asyncHandler(async (req, res) => {
  const sentPosts = await Post.create(data);
  res.json({ message: "Posts have been added", data: sentPosts });
});
