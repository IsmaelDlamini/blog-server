import mongoose from "mongoose";

const commentReplySchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    replyText: {
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
    isReplyingToCommentReply: {
      type: Boolean,
      required: true,
    },
    replyIdRepliedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "commentReply",
      required: false,
      default: null
    }, 
    numberOfResponses: {
      type: Number,
      default: 0,
    }

  },
  { timestamps: true }
);

const CommentReply = mongoose.model("CommentReply", commentReplySchema);

export default CommentReply;