import { Comment } from "../comments/comment.model";
import { Post } from "../posts/post.model";
import { User } from "../users/user.model";

export const flushCollections = async () => {
  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
  ]);
};
