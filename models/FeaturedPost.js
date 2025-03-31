import mongoose from "mongoose";


const featuredPostSchema = new mongoose.Schema({

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", 
        required: true,
        default: 1,
    }

}, { timestamps: true})

const FeaturedPost = mongoose.model("FeaturedPost", featuredPostSchema);
export default FeaturedPost;




