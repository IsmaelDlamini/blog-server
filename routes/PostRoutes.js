import express from "express";
import {getPostContentById, getPosts} from "../controllers/PostController.js";
import { importTestPosts } from "../controllers/PostController.js";
import { createPost } from "../controllers/PostController.js";
import { deletePost } from "../controllers/PostController.js";

const postRouter = express.Router();

// @desc Get all posts
// @route GET /api/posts

postRouter.get("/", getPosts);
// postRouter.post("/import", importTestPosts);

// @desc create a post and its content
// @route POST /api/posts/create

postRouter.post("/create", createPost);

// @desc get the content of a post
// @route POST /api/posts/content/:id

postRouter.get("/content/:id", getPostContentById);

// @desc delete a post
// @route DELETE /api/posts/delete/:id

postRouter.delete("/delete/:id", deletePost);


export default postRouter;
