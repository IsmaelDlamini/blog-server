import mongoose, { mongo } from "mongoose";

const CommentLikeSchema = new mongoose.Schema(
  {
    likeAuthorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    likeCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const CommentLike = mongoose.model("commentLike", CommentLikeSchema);

export default CommentLike;
