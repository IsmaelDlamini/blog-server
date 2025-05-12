import mongoose from "mongoose";
import CommentReply from "../models/CommentReply";
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
  } = req.body;

  const createdComment = CommentReply.create({
    commentId: _commentId,
    replyText: _replyText,
    authorName: _authorName,
    authorId: _userId,
    isReplyingToCommentReply: _isReplyingToReply,
    replyIdRepliedTo: _replyId,
  });

  res.json({
    messsage: "Reply has been created successfully!",
    reply: createdComment,
  });
});
