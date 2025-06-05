import mongoose from "mongoose";
import CommentReply from "../models/CommentReply.js";
import asyncHandler from "express-async-handler";
import Comment from "../models/CommentModel.js";
import CommentReplyLike from "../models/CommentReplyLike.js";

// @desc
// @path
// @access

export const createCommentReply = asyncHandler(async (req, res) => {
  const _userId = req.user.userId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      _replyText,
      _commentId,
      _authorName,
      _isReplyingToReply,
      _replyId,
      _commentRepliedToAuthor,
    } = req.body;

    const createdComment = await CommentReply.create({
      commentId: _commentId,
      replyText: _replyText,
      authorName: _authorName,
      authorId: _userId,
      isReplyingToCommentReply: _isReplyingToReply,
      replyIdRepliedTo: _replyId,
      commentRepliedtoAuthorName: _commentRepliedToAuthor,
    }, {session});

    await Comment.findByIdAndUpdate(
      _commentId,
      { $inc: { numberOfComments: -1 } }, // Increment by 1
      { new: true, session }
    );

    res.json({
      messsage: "Reply has been created successfully!",
      reply: createdComment,
    });

    await session.commitTransaction();
    session.endSession();

  } catch (error) {

    await session.abortTransaction();
    session.endSession();
    console.error("Like toggle transaction failed:", error);
    res.status(500).json({ message: "Server error creating comment reply." });
  }
});

// @desc
// @path
// @access

export const fetchCommentReplies = asyncHandler(async (req, res) => {
  const { _commentId } = req.body;
  const _userId = req.user.userId;


   let fetchedCommentsResult = [];
  
    if (mongoose.Types.ObjectId.isValid(_commentId)) {
      const fetchedComments = await CommentReply.find({ commentId: _commentId }); // return all comments in collection
  
      const fetchedLikes = await CommentReplyLike.find({
        likeAuthorId: _userId,
        parentCommentId: _commentId,
      });
  
      const likeMap = new Map();
      fetchedLikes.forEach((like) => {
        likeMap.set(like.likeCommentReplyId.toString(), true);
      });
  
      fetchedCommentsResult = fetchedComments.map((commentReply) => {
        return {
          ...commentReply.toObject(),
          likedByUser: likeMap.has(commentReply._id.toString()),
        };
      });
    } else {
  
      fetchedCommentsResult = await CommentReply.find({ commentId: _commentId });
  
    }
  // const commentReplies = await CommentReply.find({ commentId: _commentId });

  res.json({
    message: "Fetched comment replies successfully.",
    replies: fetchedCommentsResult,
  });
});



export const ToggleCommmentReplyLike = asyncHandler(async (req, res) => {
  const { commentId, parentCommentId } = req.body;
  const authorId = req.user.userId;

  const session = await mongoose.startSession();
  session.startTransaction(); // start the transaction

  try {
    // Check if the like exists for the given comment and post
    const likeExists = await CommentReplyLike.findOne({
      likeAuthorId: authorId,
      likeCommentReplyId: commentId,
      parentCommentId: parentCommentId,
    }).session(session); // Ensure the query runs within the session

    if (likeExists) {
      // If like exists, remove it and decrement the like count
      await CommentReplyLike.deleteOne({ _id: likeExists._id }, { session });

      await CommentReply.findByIdAndUpdate(
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
      const createCommentReplyLike = await CommentReplyLike.create(
        [{
          likeAuthorId: authorId,
          likeCommentReplyId: commentId,
          parentCommentId: parentCommentId,
        }],
        { session }
      );

      const updateNumberOfLikes = await CommentReply.findByIdAndUpdate(
        commentId,
        { $inc: { numberOfLikes: 1 } }, // Increment by 1
        { new: true, session }
      );

      await session.commitTransaction();
      return res.json({
        message: "Like has been added!",
        like: createCommentReplyLike,
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



