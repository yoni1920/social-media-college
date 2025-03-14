import axios from "axios";
import { tokenRefreshInterceptor } from "./interceptors";

export const postsApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL || window.location.origin}/posts`,
  withCredentials: true,
});

postsApi.interceptors.response.use(
  ...tokenRefreshInterceptor(postsApi, { toLoginOnError: true })
);
