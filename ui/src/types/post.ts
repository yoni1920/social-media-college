export type TPost = {
  _id: string;
  message: string;
  fileName: string;
  sender: { _id: string; username: string; name: string; picture: string };
  likes: { user: string }[];
  numComments: number;
};
