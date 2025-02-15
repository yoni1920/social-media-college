import { PaginateModel, PaginateResult, Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { v4 as uuidV4 } from "uuid";
import { BaseResource, ResourceSchemaMetadata } from "../types/resources";

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

export const commentsMetadata = {
  modelName: "Comment",
  virtualFields: {
    NUM_COMMENTS: "numComments",
  },
  fields: {
    POST_ID: "postID",
  },
} as const satisfies ResourceSchemaMetadata<Comment>;

commentSchema.plugin(paginate);

export type PaginatedCommentsResult = Pick<
  PaginateResult<Comment>,
  "docs" | "totalPages" | "page"
>;

export const CommentModel = model<Comment, PaginateModel<Comment>>(
  commentsMetadata.modelName,
  commentSchema
);
