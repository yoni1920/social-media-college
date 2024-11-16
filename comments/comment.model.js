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
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    postID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = model("Comment", commentSchema);
