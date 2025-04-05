import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: null,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: null,
    required: false,
  },
  phone: {
    type: String,
    default: null,
    required: false,
  },
  posts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "posts",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
