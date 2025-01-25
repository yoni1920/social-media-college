import axios from "axios";

export const postsApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/posts`,
  withCredentials: true,
});
