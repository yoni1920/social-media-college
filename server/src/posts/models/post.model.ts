import { PaginateModel, PaginateResult, Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
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

export type PaginatedPostsResult = Pick<
  PaginateResult<Post>,
  "totalPages" | "page" | "docs"
>;

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

postSchema.plugin(paginate);

export const PostModel = model<Post, PaginateModel<Post>>(
  postsMetadata.modelName,
  postSchema
);
