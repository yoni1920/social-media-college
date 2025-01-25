import { TPost } from "./post";

export type TComment = {
  _id: string;
  message: string;
  sender: TPost["sender"];
  postId: string;
};
