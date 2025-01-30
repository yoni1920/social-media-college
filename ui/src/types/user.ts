export type User = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  bio: string;
  name?: string;
  picture: string;
};
