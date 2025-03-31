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

// @desc delete a 
// @route GET /api/posts/:id
// @access Public



// ! this is just a route to post all data to the database

export const importTestPosts = asyncHandler( async(req, res) => {

    const sentPosts = await Post.create(data);
    res.json({message: "Posts have been added", data: sentPosts});

})
