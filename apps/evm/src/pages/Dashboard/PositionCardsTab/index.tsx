import { Fragment, type Key, type ReactNode } from 'react';

import { CellGroup, type CellProps, Pagination } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import { useCardGridPagination } from 'hooks/useCardGridPagination';
import { Placeholder } from '../Placeholder';

export interface PositionCardsTabProps<Item> {
  items: Item[];
  activePositionFilter: (item: Item) => boolean;
  summaryCells: CellProps[];
  placeholderTitle: string;
  placeholderRoute: string;
  placeholderOnClick?: () => void;
  renderCard: (item: Item, isPreview: boolean) => ReactNode;
  getKey: (item: Item) => Key;
  previewItems?: Item[];
  paginationParamKey: string;
}

export const PositionCardsTab = <Item,>({
  items,
  activePositionFilter,
  summaryCells,
  placeholderTitle,
  placeholderRoute,
  placeholderOnClick,
  renderCard,
  getKey,
  previewItems,
  paginationParamKey,
}: PositionCardsTabProps<Item>) => {
  const activeItems = items.filter(activePositionFilter);
  const isSmOrUp = useBreakpointUp('sm');
  const is2xlOrUp = useBreakpointUp('2xl');
  let columnCount = isSmOrUp ? 2 : 1;

  if (is2xlOrUp) {
    columnCount = 3;
  }

  const { pageItems, itemsPerPageCount, setCurrentPage } = useCardGridPagination({
    items: activeItems,
    columnCount,
    paramKey: paginationParamKey,
  });

  if (activeItems.length === 0) {
    const visiblePreviewItems = previewItems ?? items.slice(0, 3);

    return (
      <>
        <Placeholder
          title={placeholderTitle}
          to={placeholderRoute}
          onButtonClick={placeholderOnClick}
        />

        {visiblePreviewItems.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3 mt-6">
            {visiblePreviewItems.map(item => (
              <Fragment key={getKey(item)}>{renderCard(item, true)}</Fragment>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <CellGroup cells={summaryCells} className="mb-6" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {pageItems.map(item => (
          <Fragment key={getKey(item)}>{renderCard(item, false)}</Fragment>
        ))}
      </div>

      <Pagination
        className="mt-6"
        itemsCount={activeItems.length}
        itemsPerPageCount={itemsPerPageCount}
        paramKey={paginationParamKey}
        onChange={setCurrentPage}
      />
    </>
  );
};
