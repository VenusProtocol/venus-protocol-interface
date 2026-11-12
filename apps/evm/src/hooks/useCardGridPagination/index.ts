import { useUrlPagination } from 'hooks/useUrlPagination';

const ROWS_PER_PAGE = 2;

export interface UseCardGridPaginationInput<Item> {
  items: Item[];
  columnCount: number;
  paramKey?: string;
}

export const useCardGridPagination = <Item>({
  items,
  columnCount,
  paramKey,
}: UseCardGridPaginationInput<Item>) => {
  const { currentPage, setCurrentPage } = useUrlPagination({ paramKey });
  const itemsPerPageCount = columnCount * ROWS_PER_PAGE;
  const firstItemIndex = currentPage * itemsPerPageCount;

  return {
    currentPage,
    pageItems: items.slice(firstItemIndex, firstItemIndex + itemsPerPageCount),
    itemsPerPageCount,
    setCurrentPage,
  };
};
