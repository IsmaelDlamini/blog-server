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

    console.log(fetchedComments)

    const fetchedLikes = await CommentLike.find({
      likeAuthorId: _userId,
      postId: _postId,
    });

    console.log(fetchedLikes)

    const likeMap = new Map();
    fetchedLikes.forEach((like) => {
      likeMap.set(like.likeCommentId.toString(), true);
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
    // Check if the like exists for the given comment and post
    const likeExists = await CommentLike.findOne({
      likeAuthorId: authorId,
      likeCommentId: commentId,
      postId: _postId,
    }).session(session); // Ensure the query runs within the session

    if (likeExists) {
      // If like exists, remove it and decrement the like count
      await CommentLike.deleteOne({ _id: likeExists._id }, { session });

      await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { numberOfLikes: -1 } }, // Decrement by 1
        { new: true, session }
      );

      await session.commitTransaction();
      return res.json({
        message: "Like has been removed successfully!",
        removedLike: likeExists,
      });
    } else {
      // If like doesn't exist, create a new like and increment the like count
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
        { $inc: { numberOfLikes: 1 } }, // Increment by 1
        { new: true, session }
      );

      await session.commitTransaction();
      return res.json({
        message: "Like has been added!",
        like: createCommentLike,
        updatedLikeCount: updateNumberOfLikes.numberOfLikes,
      });
    }
  } catch (error) {
    // Ensure session is aborted and cleaned up
    await session.abortTransaction();
    return res.status(500).json({ message: "Transaction failed", error: error.message });
  } finally {
    session.endSession(); // Ensure the session ends in any case
  }
});
