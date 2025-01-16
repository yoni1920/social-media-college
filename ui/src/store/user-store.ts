import { create } from "zustand";
import { User } from "../types";

type UserState = {
  user: User | null;
};

type UserActions = {
  saveUser: (user: User) => void;
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  user: null,
  saveUser: (user: User) => set({ user }),
}));
