import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// ✅ Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("user", "-password"); // hide password
    if (!blogs || blogs.length === 0) {
      return res.status(200).send({
        success: false,
        message: "No blogs found",
      });
    }
    return res.status(200).send({
      success: true,
      blogCount: blogs.length,
      message: "All blogs list",
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Failed to get all blogs",
      success: false,
      error: error.message,
    });
  }
};

// ✅ Create blog
const createBlog = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;

    if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Check if userId is valid
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user ID",
      });
    }

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const blog = new Blog({ title, description, image, user });

    // ✅ Transaction for consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    await blog.save({ session });
    existingUser.blogs.push(blog._id); // ✅ push only blog ID
    await existingUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).send({
      message: "Blog created successfully",
      success: true,
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Failed to create blog",
      success: false,
      error: error.message,
    });
  }
};

// ✅ Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { title, description, image },
      { new: true }
    );

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).send({
      message: "Blog updated successfully",
      success: true,
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Failed to update blog",
      success: false,
      error: error.message,
    });
  }
};

// ✅ Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(id).populate("user", "-password");

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).send({
      message: "Blog fetched successfully",
      success: true,
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Failed to get blog by ID",
      success: false,
      error: error.message,
    });
  }
};

// ✅ Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findByIdAndDelete(id).populate("user");

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.user) {
      blog.user.blogs.pull(blog._id); // ✅ remove reference
      await blog.user.save();
    }

    return res.status(200).send({
      message: "Blog deleted successfully",
      success: true,
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Failed to delete blog",
      success: false,
      error: error.message,
    });
  }
};

// ✅ Get blogs of a user
const userBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user ID",
      });
    }

    const userBlog = await User.findById(id).populate("blogs");

    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: "No blogs found for this user",
      });
    }

    return res.status(200).send({
      message: "User blogs fetched successfully",
      success: true,
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in fetching user blogs",
      success: false,
      error: error.message,
    });
  }
};

export { getAllBlogs, createBlog, updateBlog, getBlogById, deleteBlog, userBlog };
