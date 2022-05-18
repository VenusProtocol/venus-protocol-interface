import { useEffect, useState } from 'react';
import { useTranslation } from 'translation';

type IPaginationProps<Row> = {
  data: Row[];
  initialPageNumber?: number;
  rowsPerPageCount?: number;
};

export function usePagination<Row>({
  data,
  initialPageNumber = 1,
  rowsPerPageCount = 10,
}: IPaginationProps<Row>) {
  const { t } = useTranslation();

  const initialPageIndex = initialPageNumber - 1;

  const [currentPageData, setCurrentPageData] = useState<Row[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(initialPageIndex);
  const [pagesCount, setPagesCount] = useState(0);
  const itemsCount = data.length;

  /* calculating rows per page count */
  useEffect(() => {
    setPagesCount(Math.ceil(itemsCount / rowsPerPageCount));
  }, [rowsPerPageCount]);

  // const isFirstPage = currentPageIndex === 0;
  const isLastPage = activePageIndex === pagesCount - 1;
  const currentPageFirstIndex = activePageIndex * rowsPerPageCount;
  const currentPageLastIndex = isLastPage ? itemsCount : currentPageFirstIndex + rowsPerPageCount;
  const firstItemNumberInRow = currentPageFirstIndex + 1;
  const isSingleItemOnPage = firstItemNumberInRow === currentPageLastIndex;
  const itemsCountString = isSingleItemOnPage
    ? t('pagination.itemOf', { currentPageLastIndex, itemsCount })
    : t('pagination.itemsOf', { firstItemNumberInRow, currentPageLastIndex, itemsCount });

  /* setting data for selected page */
  useEffect(() => {
    const newPageData = data.slice(currentPageFirstIndex, currentPageLastIndex);
    setCurrentPageData(newPageData);
  }, [activePageIndex, rowsPerPageCount]);

  return {
    pagesCount,
    activePageIndex,
    currentPageData,
    itemsCountString,
    goToNextPage: () => setActivePageIndex(activePageIndex + 1),
    goToPreviousPage: () => setActivePageIndex(activePageIndex - 1),
    goToPageByIndex: (pageIndex: number) => setActivePageIndex(pageIndex),
  };
}
