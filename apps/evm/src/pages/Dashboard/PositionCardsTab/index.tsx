import { Fragment, type Key, type ReactNode } from 'react';

import { CellGroup, type CellProps, type IconName } from 'components';
import { Placeholder } from '../Placeholder';

export interface PositionCardsTabProps<Item> {
  items: Item[];
  activePositionFilter: (item: Item) => boolean;
  summaryCells: CellProps[];
  placeholderIconName: IconName;
  placeholderTitle: string;
  placeholderRoute: string;
  placeholderOnClick?: () => void;
  renderCard: (item: Item, isPreview: boolean) => ReactNode;
  getKey: (item: Item) => Key;
  previewItems?: Item[];
}

export const PositionCardsTab = <Item,>({
  items,
  activePositionFilter,
  summaryCells,
  placeholderIconName,
  placeholderTitle,
  placeholderRoute,
  placeholderOnClick,
  renderCard,
  getKey,
  previewItems,
}: PositionCardsTabProps<Item>) => {
  const activeItems = items.filter(activePositionFilter);

  if (activeItems.length === 0) {
    const visiblePreviewItems = previewItems ?? items.slice(0, 3);

    return (
      <>
        <Placeholder
          iconName={placeholderIconName}
          title={placeholderTitle}
          to={placeholderRoute}
          buttonSize="sm"
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
        {activeItems.map(item => (
          <Fragment key={getKey(item)}>{renderCard(item, false)}</Fragment>
        ))}
      </div>
    </>
  );
};
