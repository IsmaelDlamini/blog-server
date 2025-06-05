import express from "express";
import {
  CreateComment,
  fetchAllCommentsForPost,
  ToggleCommmentLike,
} from "../controllers/CommentController.js";
import { checkForTokenWeak, verifyToken } from "../config/jwtAuth.js";
import { createCommentReply, fetchCommentReplies, ToggleCommmentReplyLike } from "../controllers/CommentReplyController.js";

const commentRouter = express.Router();

// @desc create comment
// @route /api/comments/add

commentRouter.post("/create", CreateComment);

commentRouter.post("/toggleLike", checkForTokenWeak, ToggleCommmentLike);
commentRouter.post("/commentReplies/create",checkForTokenWeak,  createCommentReply);

commentRouter.post("/toggleCommentReplyLike", verifyToken, ToggleCommmentReplyLike);

//fetch comment replies

commentRouter.post("/commentReplies", verifyToken, fetchCommentReplies);

commentRouter.get("/:_postId", checkForTokenWeak, fetchAllCommentsForPost);

export default commentRouter;
