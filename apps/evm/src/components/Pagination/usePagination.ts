import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useTranslation } from 'libs/translations';

type PaginationProps = {
  itemsCount: number;
  onChange: (newPageIndex: number) => void;
  itemsPerPageCount?: number;
};

const PAGE_PARAM_KEY = 'page';
const PAGES_TO_SHOW_COUNT = 4;

export function usePagination({ itemsCount, onChange, itemsPerPageCount = 10 }: PaginationProps) {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const [urlPageParam, activePageIndex] = useMemo(() => {
    const pageParam = searchParams.get(PAGE_PARAM_KEY);
    const pageIndex = pageParam ? +pageParam - 1 : 0;

    return [pageParam, pageIndex];
  }, [searchParams]);

  // Automatically set default page param if none was set
  useEffect(() => {
    if (urlPageParam === undefined) {
      setSearchParams({
        [PAGE_PARAM_KEY]: '1',
      });
    }
  }, [urlPageParam, setSearchParams]);

  const [pagesCount, setPagesCount] = useState(0);

  /* calculating items per page count */
  useEffect(() => {
    setPagesCount(Math.ceil(itemsCount / itemsPerPageCount));
  }, [itemsPerPageCount, itemsCount]);

  const isLastPage = activePageIndex === pagesCount - 1;
  const currentPageFirstIndex = activePageIndex * itemsPerPageCount;
  const currentPageLastIndex = isLastPage ? itemsCount : currentPageFirstIndex + itemsPerPageCount;
  const firstItemNumber = currentPageFirstIndex + 1;
  const isSingleItemOnPage = firstItemNumber === currentPageLastIndex;
  const itemsCountString = isSingleItemOnPage
    ? t('pagination.itemOf', { currentPageLastIndex, itemsCount })
    : t('pagination.itemsOf', { firstItemNumber, currentPageLastIndex, itemsCount });

  /* creating pages array */
  const pagesArray = Array.from({ length: pagesCount }, (_, i) => i + 1);

  const halfOfPagesCount = Math.ceil(PAGES_TO_SHOW_COUNT / 2);
  const lastPageIndex = pagesCount - 1;
  const isActivePageInEnd = activePageIndex > lastPageIndex - halfOfPagesCount;
  const isActivePageInStart = activePageIndex < halfOfPagesCount;

  const minPageIndexToShow = isActivePageInEnd
    ? lastPageIndex - PAGES_TO_SHOW_COUNT
    : activePageIndex - halfOfPagesCount;

  const maxPageIndexToShow = isActivePageInStart
    ? PAGES_TO_SHOW_COUNT
    : activePageIndex + halfOfPagesCount;

  const handlePageChange = (pageIndex: number) => {
    setSearchParams({
      [PAGE_PARAM_KEY]: pageIndex.toString(),
    });

    onChange(pageIndex);
  };

  return {
    pagesCount,
    activePageIndex,
    itemsCountString,
    goToPageByIndex: handlePageChange,
    pagesArray,
    minPageIndexToShow,
    maxPageIndexToShow,
  };
}
