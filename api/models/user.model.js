import mongoose from "mongoose";

const useSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://i.stack.imgur.com/34AD2.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", useSchema);

export default User;
