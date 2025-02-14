import { Schema, model } from "mongoose";
import { User } from "users/user.model";
import { v4 as uuidV4 } from "uuid";
import { commentsMetadata } from "../../comments/comment.model";
import {
  BaseResource,
  baseResourceMetadata,
  ResourceSchemaMetadata,
} from "../../types/resources";
import { Like, likesMetadata } from "./like.model";

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

export const postsMetadata = {
  modelName: "Post",
} as const satisfies ResourceSchemaMetadata<Post>;

postSchema.virtual(likesMetadata.virtualFields.LIKES, {
  ref: likesMetadata.modelName,
  localField: baseResourceMetadata.fields.ID,
  foreignField: likesMetadata.fields.POST,
});

postSchema.virtual(commentsMetadata.virtualFields.NUM_COMMENTS, {
  ref: commentsMetadata.modelName,
  localField: baseResourceMetadata.fields.ID,
  foreignField: commentsMetadata.fields.POST_ID,
  justOne: true,
  count: true,
});

export const PostModel = model<Post>(postsMetadata.modelName, postSchema);
