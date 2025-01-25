import axios from "axios";

export const profileApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/users`,
  withCredentials: true,
});
