
import express from "express"
import { CreateComment, fetchAllCommentsForPost, ToggleCommmentLike } from "../controllers/CommentController.js";
import { checkForTokenWeak } from "../config/jwtAuth.js";

const commentRouter = express.Router();

// @desc create comment
// @route /api/comments/add

commentRouter.post("/create", CreateComment);
commentRouter.get("/:_postId", checkForTokenWeak, fetchAllCommentsForPost);
commentRouter.post("/toggleLike", ToggleCommmentLike)

export default commentRouter;




