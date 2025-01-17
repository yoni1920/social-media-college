import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from "axios";
import { HttpStatus } from "../enums";
import { authApi } from "./auth-api";

export const selfAuthApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  withCredentials: true,
});

selfAuthApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const isAccessTokenExpired =
      error.response && error.response.status === HttpStatus.UNAUTHORIZED;

    if (!isAccessTokenExpired) {
      return Promise.reject(error);
    }

    try {
      await authApi.post("/refresh");

      return selfAuthApi(error.config as AxiosRequestConfig);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);
