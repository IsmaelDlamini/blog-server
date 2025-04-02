import express from "express";
import {getPosts} from "../controllers/PostController.js";
import { importTestPosts } from "../controllers/PostController.js";
import { createPost } from "../controllers/PostController.js";

const postRouter = express.Router();

// @desc Get all posts
// @route GET /api/posts
// @access Public

postRouter.get("/", getPosts);
postRouter.post("/import", importTestPosts);

// @desc create a post and its content
// @route POST /api/posts/create
// @access Public

postRouter.post("/create", createPost);

export default postRouter;
