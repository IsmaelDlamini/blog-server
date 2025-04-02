import asyncHandler from "express-async-handler";
import Post from "../models/BlogPost.js";
import { data } from "../data/importData.js";
import PostContent from "../models/PostContent.js";

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
    PostContent,
    PostAuthor,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction(); // Start a transaction

  try {
    // Step 1: Create the Post document
    const post = await Post.create(
      [
        {
          PostType,
          PostLenght,
          PostTitle,
          PostDescription,
          PostImage,
          PostContent,
          PostAuthor,
        },
      ],
      { session }
    );

    // Step 2: Create the PostContent document using the Post's _id
    const postContent = await PostContent.create(
      [
        {
          postId: post[0]._id,
          content: PostContent,
        },
      ],
      { session }
    );

    // Step 3: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    console.log("Post and PostContent created successfully!");
  } catch (error) {
    // Rollback in case of failure
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
  }
});

// ! this is just a route to post all data to the database

export const importTestPosts = asyncHandler(async (req, res) => {
  const sentPosts = await Post.create(data);
  res.json({ message: "Posts have been added", data: sentPosts });
});
