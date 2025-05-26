import mongoose from "mongoose";
import CommentReply from "../models/CommentReply.js";
import asyncHandler from "express-async-handler";

// @desc
// @path
// @access

export const createCommentReply = asyncHandler(async (req, res) => {
  const _userId = req.user.userId;

  const {
    _replyText,
    _commentId,
    _authorName,
    _isReplyingToReply,
    _replyId,
    _commentRepliedToAuthor,
  } = req.body;

  const createdComment = CommentReply.create({
    commentId: _commentId,
    replyText: _replyText,
    authorName: _authorName,
    authorId: _userId,
    isReplyingToCommentReply: _isReplyingToReply,
    replyIdRepliedTo: _replyId,
    commentRepliedtoAuthorName: _commentRepliedToAuthor,
  });

  res.json({
    messsage: "Reply has been created successfully!",
    reply: createdComment,
  });
});

// @desc
// @path
// @access

export const fetchCommentReplies = asyncHandler(async (req, res) => {
  const {_commentId } = req.body;

  if (!mongoose.isValidObjectId(_commentId)) {
    return res.status(400).json({ message: "Invalid comment ID." });
  }

  const commentReplies = await CommentReply.find({ commentId: _commentId });

  res.json({
    message: "Fetched comment replies successfully.",
    replies: commentReplies,
  });
});
