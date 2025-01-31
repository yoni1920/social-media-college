import axios from "axios";
import { tokenRefreshInterceptor } from "./interceptors";

export const postsApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/posts`,
  withCredentials: true,
});

postsApi.interceptors.response.use(
  ...tokenRefreshInterceptor(postsApi, { toLoginOnError: true })
);
