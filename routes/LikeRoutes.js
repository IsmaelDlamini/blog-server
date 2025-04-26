
import express from "express";
import { toggleLike } from "../controllers/LikeController.js";
import { verifyToken } from "../config/jwtAuth.js";

const likeRouter = express.Router();

// @desc create a like
// @route POST /api/likes

likeRouter.post("/toggle", toggleLike);

export default likeRouter;




