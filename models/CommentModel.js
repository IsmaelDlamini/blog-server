import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    commentText: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    numberOfReplies: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
