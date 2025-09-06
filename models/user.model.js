import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog", // correct usage
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
