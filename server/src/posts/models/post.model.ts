import mongoose, { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { BaseResource } from "../../types/resources";
import { User } from "users/user.model";
import { Like } from "./like.model";

export interface Post extends BaseResource {
  message: string;
  sender: Pick<User, "_id" | "username">;
  fileName: string;
  likes: Like[];
}

const postSchema = new Schema<Post>(
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
    fileName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "post",
});

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postID",
});

export const PostModel = model<Post>("Post", postSchema);
