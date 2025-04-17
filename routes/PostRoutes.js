import express from "express";
import {getPostContentById, getPosts} from "../controllers/PostController.js";
import { importTestPosts } from "../controllers/PostController.js";
import { createPost } from "../controllers/PostController.js";
import { deletePost } from "../controllers/PostController.js";
import Post from "../models/BlogPost.js";

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

// // routes/posts.js
// postRouter.patch("/init-fields", async (req, res) => {
//     try {
//       await Post.updateMany(
//         {
//           $or: [
//             { numberOfComments: { $exists: false } },
//             { numberOfLikes: { $exists: false } },
//           ],
//         },
//         {
//           $set: {
//             numberOfComments: 0,
//             numberOfLikes: 0,
//           },
//         }
//       );
//       res.status(200).json({ message: "Posts updated with default fields" });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
  

export default postRouter;
