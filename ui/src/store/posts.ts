import { create } from "zustand";
import { TPost } from "../types/post";
import { PageData } from "../hooks/use-paginated-query";

export enum PostsOrigin {
  USER = "USER",
  PROFILE = "PROFILE",
  HOME = "HOME",
}

type PostsState = PageData<TPost> & {
  origin: PostsOrigin;
};

type PostsActions = {
  setPageData: (pageData: PageData<TPost>) => void;
  setPage: (page: number) => void;
  resetPosts: (origin: PostsOrigin) => void;
};

export const usePostsStore = create<PostsState & PostsActions>((set) => ({
  data: [],
  totalPages: 0,
  page: 1,
  origin: PostsOrigin.HOME,
  setPage: (page) => set({ page }),
  setPageData: (pageData) => set(pageData),
  resetPosts: (origin: PostsOrigin) =>
    set({ data: [], totalPages: 0, page: 1, origin }),
}));
