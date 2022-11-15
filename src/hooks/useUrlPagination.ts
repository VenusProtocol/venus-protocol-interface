import { useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export type UseUrlPaginationInput = Pick<RouteComponentProps, 'location' | 'history'>;

export type UseUrlPaginationOutput = {
  currentPage: number;
  setCurrentPage: (newPageIndex: number) => void;
};

export const PAGE_PARAM_NAME = 'page';

const useUrlPagination = ({ location, history }: UseUrlPaginationInput): UseUrlPaginationOutput => {
  const { search } = location;

  useEffect(() => {
    // Add page param to URl if none has been set
    const searchParams = new URLSearchParams(search);

    if (!searchParams.get(PAGE_PARAM_NAME)) {
      // Note: although the pagination starts from 0, we make it start from 1 in the
      // URL to make it more user-friendly. This is something we need to account for
      // when updating the page search param
      searchParams.set(PAGE_PARAM_NAME, '1');
      history.replace(`${location.pathname}?${searchParams.toString()}`);
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
    history.push(`${location.pathname}?${searchParams.toString()}`);
  };

  return { currentPage, setCurrentPage };
};

export default useUrlPagination;
