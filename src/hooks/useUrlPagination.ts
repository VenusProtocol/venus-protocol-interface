import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type UseUrlPaginationOutput = {
  currentPage: number;
  setCurrentPage: (newPageIndex: number) => void;
};

export const PAGE_PARAM_NAME = 'page';

const useUrlPagination = (): UseUrlPaginationOutput => {
  const location = useLocation();
  const navigate = useNavigate();

  const { search } = location;

  useEffect(() => {
    // Add page param to URL if none has been set
    const searchParams = new URLSearchParams(search);

    if (!searchParams.get(PAGE_PARAM_NAME)) {
      // Note: although the pagination starts from 0, we make it start from 1 in the
      // URL to make it more user-friendly. This is something we need to account for
      // when updating the page search param
      searchParams.set(PAGE_PARAM_NAME, '1');
      navigate(`${location.pathname}?${searchParams.toString()}`);
    }

    // Scroll to the top of the page on search change
    window.scrollTo(0, 0);
  }, [search]);

  const currentPage = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return searchParams.get(PAGE_PARAM_NAME)
      ? +(searchParams.get(PAGE_PARAM_NAME) as string) - 1
      : 0;
  }, [search]);

  const setCurrentPage = (newPageIndex: number) => {
    const searchParams = new URLSearchParams(search);

    // Update page param in URL search
    searchParams.set(PAGE_PARAM_NAME, `${newPageIndex + 1}`);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return { currentPage, setCurrentPage };
};

export default useUrlPagination;
