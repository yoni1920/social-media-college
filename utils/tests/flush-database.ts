import { CommentModel } from "../../comments/comment.model";
import { PostModel } from "../../posts/post.model";
import { UserModel } from "../../users/user.model";

export const flushCollections = async () => {
  await Promise.all([
    UserModel.deleteMany({}),
    PostModel.deleteMany({}),
    CommentModel.deleteMany({}),
  ]);
};
