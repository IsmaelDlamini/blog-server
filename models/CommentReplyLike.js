import mongoose, { mongo } from "mongoose";

const CommentReplyLikeSchema = new mongoose.Schema(
  {
    likeAuthorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    likeCommentReplyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "commentReplies",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommentReplyLike = mongoose.model("commentReplyLike", CommentReplyLikeSchema);

export default CommentReplyLike;
