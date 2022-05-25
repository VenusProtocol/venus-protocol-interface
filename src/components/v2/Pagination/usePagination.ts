import { useEffect, useState } from 'react';

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
  const initialPageIndex = initialPageNumber - 1;

  const [currentPageData, setCurrentPageData] = useState<Row[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(initialPageIndex);
  const [pagesCount, setPagesCount] = useState(0);

  /* calculating rows per page count */
  useEffect(() => {
    setPagesCount(Math.ceil(data.length / rowsPerPageCount));
  }, [rowsPerPageCount]);

  // const isFirstPage = currentPageIndex === 0;
  const isLastPage = activePageIndex === pagesCount - 1;
  const currentPageFirstIndex = activePageIndex * rowsPerPageCount;
  const currentPageLastIndex = isLastPage ? data.length : currentPageFirstIndex + rowsPerPageCount;
  const firstItemNumberInRow = currentPageFirstIndex + 1;
  const isSingleItemOnPage = firstItemNumberInRow === currentPageLastIndex;
  const itemsCountString = isSingleItemOnPage
    ? `${currentPageLastIndex} item of ${data.length}`
    : `${firstItemNumberInRow} - ${currentPageLastIndex} items of ${data.length}`;

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
