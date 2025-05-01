import asyncHandler from "express-async-handler";
import Comment from "../models/CommentModel.js";
import mongoose from "mongoose";
import CommentLike from "../models/CommentLikeModel.js";

// @desc add a comment
// @route DELETE /api/posts/:id
// @access Public

export const CreateComment = asyncHandler(async (req, res) => {
  const { _userId, _postId, _commentText, _authorName } = req.body;

  const createdComment = await Comment.create({
    postId: _postId,
    commentText: _commentText,
    authorName: _authorName,
    authorId: _userId,
  });

  res.json({
    message: "Comment created successfully!",
    comment: createdComment,
  });
});

// @desc get comments
// @route GET /api/comments/:postId
// @access Public

export const fetchAllCommentsForPost = asyncHandler(async (req, res) => {
  const { _postId } = req.params; // Match the route definition: /api/comments/:postId
  const _userId = req.user.userId;

  let fetchedCommentsResult = [];

  if (mongoose.Types.ObjectId.isValid(_userId)) {
    const fetchedComments = await Comment.find({ postId: _postId }); // return all comments in collection

    const fetchedLikes = await CommentLike.find({
      likeAuthorId: _userId,
      postId: _postId,
    });

    const likeMap = new Map();
    fetchedLikes.forEach((like) => {
      likeMap.set(like.commentId.toString(), true);
    });

    fetchedCommentsResult = fetchedComments.map((comment) => {
      return {
        ...comment.toObject(),
        likedByUser: likeMap.has(comment._id.toString()),
      };
    });
  } else {

    fetchedCommentsResult = await Comment.find({ postId: _postId });

  }

  res.json({
    message: "Comments fetched successfully!",
    comments: fetchedCommentsResult,
  });
});


export const ToggleCommmentLike = asyncHandler(async (req, res) => {
  const { commentId, _postId } = req.body;

  const authorId = req.user.userId;

  const session = await mongoose.startSession();
  session.startTransaction(); // start the transaction

  try {

    console.log(commentId)
    console.log(_postId)
    console.log(authorId)

    const likeExists = await CommentLike.findOne({
      likeAuthorId: authorId,
      likeCommentId: commentId,
      postId: _postId,
    });

    if (likeExists) {
      await CommentLike.deleteOne({ _id: likeExists._id }, { session });

      await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { numberOfLikes: -1 } }, // Increment by 1
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      res.json({
        message: "like has been removed successfully!",
        removedLike: likeExists,
      });
    } else {
      const createCommentLike = await CommentLike.create(
        [{
          likeAuthorId: authorId,
          likeCommentId: commentId,
          postId: _postId,
        }],
        { session }
      );

      const updateNumberOfLikes = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { numberOfLikes: +1 } }, // Increment by 1
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      res.json({ message: "like has been added!", like: createCommentLike });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ message: "Transaction failed", error: error.message });
  }
});
