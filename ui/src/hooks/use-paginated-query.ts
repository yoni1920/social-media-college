import { useCallback, useEffect, useState } from "react";
import { type AxiosResponse } from "axios";

interface PaginationResult<T> {
  docs: T[];
  page: number;
  totalPages: number;
}

export interface PageData {
  totalPages: number;
  page: number;
}

export const usePaginatedQuery = <T>(
  queryFn: (page: number) => Promise<AxiosResponse<PaginationResult<T>>>,
  pageData: PageData = {
    totalPages: 1,
    page: 1,
  },
  setPageData: (pageData: PageData) => unknown
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<T[]>([]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await queryFn(pageData.page - 1);
      setPageData({
        page: data.page,
        totalPages: data.totalPages,
      });
      setData(data.docs);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, pageData.page]);

  useEffect(() => {
    refresh();
  }, [pageData.page]);

  return { isLoading, isError, refresh, data };
};
