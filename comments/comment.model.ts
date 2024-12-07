import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { BaseResource } from "../types/base-resource";

export interface Comment extends BaseResource {
  message: string;
  sender: string;
  postID: string;
}

const commentSchema = new Schema<Comment>(
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

export const CommentModel = model<Comment>("Comment", commentSchema);
