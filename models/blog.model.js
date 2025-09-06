import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Blog description is required"],
    },
    image: {
      type: String,
      required: [true, "Blog image URL is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // references User model
      required: [true, "Blog must belong to a user"],
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
