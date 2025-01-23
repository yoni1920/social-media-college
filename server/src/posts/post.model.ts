import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { BaseResource } from "../types/resources";
import { User } from "users/user.model";

export interface Post extends BaseResource {
  message: string;
  sender: Pick<User, "_id" | "username">;
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
