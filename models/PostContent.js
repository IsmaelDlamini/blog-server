import mongoose from "mongoose"

const postContentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const PostContent = mongoose.model("PostContent", postContentSchema)
export default PostContent
