import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { HttpStatus } from "../../enums";
import { authApi } from "../auth-api";

export const tokenRefreshInterceptor = (
  resourceApi: AxiosInstance,
  options?: { toLoginOnError?: boolean }
): [
  (res: AxiosResponse) => AxiosResponse,
  (error: AxiosError) => Promise<AxiosResponse>
] => [(response) => response, errorHandler(resourceApi, options)];

const errorHandler =
  (resourceApi: AxiosInstance, options?: { toLoginOnError?: boolean }) =>
  async (error: AxiosError) => {
    const isAccessTokenExpired =
      error.response && error.response.status === HttpStatus.UNAUTHORIZED;

    if (!isAccessTokenExpired) {
      return Promise.reject(error);
    }

    try {
      await authApi.post("/refresh");

      return resourceApi(error.config as AxiosRequestConfig);
    } catch (refreshError) {
      if (options?.toLoginOnError) {
        window.location.reload();
      }

      return Promise.reject(refreshError);
    }
  };
