import axios from "axios";

export const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL || window.location.origin}/auth`,
  withCredentials: true,
});
