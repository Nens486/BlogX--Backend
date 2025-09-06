import express from "express";
import { 
  getAllUsers, 
  loginUser, 
  registerUser,  // ✅ fixed spelling
  getUserById    // ✅ new controller
} from "../controllers/user.controller.js";

import { userBlog } from "../controllers/blog.controller.js"; // ✅ connect user blogs

const router = express.Router();

// Get all users
router.get("/allusers", getAllUsers);

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get user by ID
router.get("/:id", getUserById);

// Get blogs of a user
router.get("/blogs/:id", userBlog);

export default router;
