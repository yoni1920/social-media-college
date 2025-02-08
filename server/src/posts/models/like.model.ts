import { Schema, model } from "mongoose";
import { User } from "users/user.model";
import { Post } from "./post.model";

export interface Like {
  post: Post["_id"];
  user: User["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new Schema<Like>(
  {
    post: {
      type: String,
      ref: "Post",
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ post: 1, user: 1 }, { unique: true });

export const LIKES_POPULATION = {
  path: "likes",
  select: "user -_id -post",
};

export const LikeModel = model<Like>("Like", likeSchema);
