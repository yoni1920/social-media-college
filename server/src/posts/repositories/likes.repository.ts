import { LikeModel } from "../models/like.model";

const deleteLikesByPostIds = async (postIDs: string[]): Promise<void> => {
  await LikeModel.deleteMany({ post: { $in: postIDs } });
};

const deleteLikesByUserID = async (userID: string): Promise<void> => {
  await LikeModel.deleteMany({ user: userID });
};

const addLike = async (postID: string, userID: string): Promise<void> => {
  try {
    const like = new LikeModel({
      post: postID,
      user: userID,
    });

    await like.save();
  } catch (error) {
    console.error("Duplication like", error);
  }
};

const removeLike = async (postID: string, userID: string): Promise<void> => {
  await LikeModel.deleteOne({
    post: postID,
    user: userID,
  });
};

export default {
  deleteLikesByPostIds,
  deleteLikesByUserID,
  addLike,
  removeLike,
};
