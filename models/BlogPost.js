import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  PostType: {
    type: String,
    required: true,
},
  PostLenght: {
    type: String,
    required: true,
},
  PostTitle: {
    type: String,
    required: true,
},
  PostDescription: {
    type: String,
    required: true,
},
  PostImage: {
    type: String,
    required: false,
    default: null,
  },
  featured: {
    type: Boolean,
    require: false,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {});
const Post = mongoose.model("Post", PostSchema);

//TODO  fix schema, add automatic id and date created and ensure that the other parameters are filled in

export default Post;
