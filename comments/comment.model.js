import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";

const commentSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidV4,
    },
    message: {
      type: String,
      default: "",
    },
    sender: {
      type: String,
      ref: "User",
      required: true,
    },
    postID: {
      type: String,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = model("Comment", commentSchema);
