import express from "express";
import { fetchUserInfo, logout, registerUser, getAllUsers, deleteUser } from "../controllers/UserController.js";
import { login } from "../controllers/UserController.js";
import { verifyToken } from "../config/jwtAuth.js";

const userRouter = express.Router();

// @desc get all users
// @route GET /api/users/
// @access Private

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
// @access Private

userRouter.post("/logout", logout);

// @desc delete user
// @route GET /api/users/delete/:id
// @access Private

userRouter.delete("/delete/:id", deleteUser);


export default userRouter;



