import { create } from "zustand";
import { TPost } from "../types/post";
import { PageData } from "../hooks/use-paginated-query";

type PostsState = PageData<TPost>;

type PostsActions = {
  setPageData: (pageData: PageData<TPost>) => void;
  setPage: (page: number) => void;
  resetPosts: () => void;
};

export const usePostsStore = create<PostsState & PostsActions>((set) => ({
  data: [],
  totalPages: 0,
  page: 1,
  setPage: (page) => set({ page }),
  setPageData: (pageData) => set(pageData),
  resetPosts: () => set({ data: [], totalPages: 0, page: 1 }),
}));
