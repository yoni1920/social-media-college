import { Schema, model } from "mongoose";
import { User } from "users/user.model";
import { Post } from "./post.model";
import { ResourceSchemaMetadata } from "types/resources/resource-schema-metadata";
import { baseResourceMetadata } from "../../types/resources";

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

export const likesMetadata = {
  modelName: "Like",
  virtualFields: {
    LIKES: "likes",
  },
  fields: {
    POST: "post",
    USER: "user",
  },
} as const satisfies ResourceSchemaMetadata<Like>;

export const LIKES_POPULATION = {
  path: likesMetadata.virtualFields.LIKES,
  select: `${likesMetadata.fields.USER} -${baseResourceMetadata.fields.ID} -${likesMetadata.fields.POST}`,
};

export const LikeModel = model<Like>(likesMetadata.modelName, likeSchema);
