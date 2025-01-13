import axios from "axios";

export const authApi = () => {
  return axios({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  });
};
