import axios from "axios";
import { tokenRefreshInterceptor } from "./interceptors";

export const commentsApi = axios.create({
  baseURL: `${
    import.meta.env.VITE_SERVER_URL || window.location.origin
  }/comments`,
  withCredentials: true,
});

commentsApi.interceptors.response.use(
  ...tokenRefreshInterceptor(commentsApi, { toLoginOnError: true })
);
