import { useCallback, useEffect, useState } from "react";
import { type AxiosResponse } from "axios";

interface PaginationResult<T> {
  docs: T[];
  page: number;
  totalPages: number;
}

export interface PageData<T> {
  data: T[];
  totalPages: number;
  page: number;
}

export const usePaginatedQuery = <T>(
  queryFn: (page: number) => Promise<AxiosResponse<PaginationResult<T>>>,
  pageData: Omit<PageData<T>, "data"> = {
    totalPages: 1,
    page: 1,
  },
  setPageData: (pageData: PageData<T>) => unknown
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await queryFn(pageData.page - 1);
      setPageData({
        page: data.page,
        data: data.docs,
        totalPages: data.totalPages,
      });
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, pageData.page]);

  useEffect(() => {
    refresh();
  }, [pageData.page]);

  return { isLoading, isError, refresh };
};
