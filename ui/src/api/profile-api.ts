import axios from "axios";
import { tokenRefreshInterceptor } from "./interceptors";

export const profileApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL || window.location.origin}/users`,
  withCredentials: true,
});

profileApi.interceptors.response.use(
  ...tokenRefreshInterceptor(profileApi, { toLoginOnError: true })
);
