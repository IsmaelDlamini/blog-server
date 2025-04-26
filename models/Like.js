import mongoose from "mongoose";


const LikeSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

}, {})

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Like = mongoose.model("Like", LikeSchema);

export default Like;