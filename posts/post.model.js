import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { verifyCreatePostSender } from "./posts.service.js";

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

postSchema.pre("save", async function (next) {
  const post = this;
  await verifyCreatePostSender(post);

  next();
});

export const Post = model("Post", postSchema);
