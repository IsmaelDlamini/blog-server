import express from "express";
import {
  CreateComment,
  fetchAllCommentsForPost,
  ToggleCommmentLike,
} from "../controllers/CommentController.js";
import { checkForTokenWeak } from "../config/jwtAuth.js";
import { createCommentReply, fetchCommentReplies } from "../controllers/CommentReplyController.js";

const commentRouter = express.Router();

// @desc create comment
// @route /api/comments/add

commentRouter.post("/create", CreateComment);

commentRouter.post("/toggleLike", checkForTokenWeak, ToggleCommmentLike);
commentRouter.post("/commentReplies/create",checkForTokenWeak,  createCommentReply);

//fetch comment replies

commentRouter.post("/commentReplies", fetchCommentReplies);

commentRouter.get("/:_postId", checkForTokenWeak, fetchAllCommentsForPost);

export default commentRouter;
