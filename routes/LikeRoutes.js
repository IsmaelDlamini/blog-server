
import express from "express";
import Like from "../models/Like"
import { createLike } from "../controllers/LikeController";

const likeRouter = Router();

// @desc create a like
// @route POST /api/likes

likeRouter.post("/create", createLike);




