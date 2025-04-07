import express from "express";
import { fetchUserInfo, logout, registerUser, getAllUsers } from "../controllers/UserController.js";
import { login } from "../controllers/UserController.js";
import { verifyToken } from "../config/jwtAuth.js";

const userRouter = express.Router();

// @desc get all users
// @route GET /api/users/
// @access Public

userRouter.get("/", getAllUsers);

// @desc Register user
// @route GET /api/users/register
// @access Public

userRouter.post("/register", registerUser);

// @desc Login user 
// @route GET /api/users/login
// @access Public

userRouter.post("/login", login);

// @desc get the user information
// @route GET /api/users/userInfo
// @access Public

userRouter.get("/userInfo", verifyToken , fetchUserInfo);

// @desc logout user
// @route GET /api/users/logout
// @access Public

userRouter.post("/logout", logout);

export default userRouter;



