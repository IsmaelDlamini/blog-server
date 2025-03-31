import FeaturedPost from "../models/FeaturedPost";
import asyncHandler from "express-async-handler";

// @desc set featured post
// @route PUT /api/posts/:id
// @access Public

export const setFeaturedPost = asyncHandler(async (req, res) => {
  const updatedPost = await FeaturedPost.findOneAndUpdate(
    {}, // No filter needed
    { $set: { postId: "65f7c20d3b5e2f001f6e2a3d" } },
    { new: true } // Returns updated document
  );

  res.json({
    message: "The featured Post has been Updated Successfully",
    post: updatedPost,
  });
});

export const getFeaturedPost = asyncHandler( async (req, res) => {

    const featuredPost = await FeaturedPost.findOne();
    res.json(featuredPost);

})
