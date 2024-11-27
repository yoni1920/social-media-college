import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";

const postSchema = new Schema(
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
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const POST_POPULATE_ID = {
  path: "postID",
  select: "_id",
  transform: (doc, _id) => _id,
};

export const Post = model("Post", postSchema);
