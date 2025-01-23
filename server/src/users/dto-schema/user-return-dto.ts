import { User } from "../user.model";

export type UserReturnDTO = Omit<User, "password">;
