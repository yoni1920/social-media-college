import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { BaseResource } from "../types/resources";

export interface Post extends BaseResource {
  message: string;
  sender: string;
}

const postSchema = new Schema<Post>(
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

export const PostModel = model<Post>("Post", postSchema);
