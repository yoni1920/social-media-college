import axios from "axios";

export const commentsApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/comments`,
  withCredentials: true,
});
