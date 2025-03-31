import express from "express";
import {getPosts} from "../controllers/PostController.js";
import { importTestPosts } from "../controllers/PostController.js";

const postRouter = express.Router();

// @desc Get all posts
// @route GET /api/posts
// @access Public

postRouter.get("/", getPosts);
postRouter.post("/import", importTestPosts);

export default postRouter;
