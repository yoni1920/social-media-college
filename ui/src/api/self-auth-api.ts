import axios from "axios";
import { tokenRefreshInterceptor } from "./interceptors";

export const selfAuthApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  withCredentials: true,
});

selfAuthApi.interceptors.response.use(...tokenRefreshInterceptor(selfAuthApi));
