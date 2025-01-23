export type TPost = {
  _id: string;
  message: string;
  sender: { _id: string; username: string };
};
