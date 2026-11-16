import { Spinner, cn } from '@venusprotocol/ui';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useRef } from 'react';

import { Card, LabeledInlineContent } from 'components';
import { Delimiter } from '../../Delimiter';
import { Select, type SelectOption, type SelectProps } from '../../Select';
import { activateRowOnKeyDown } from '../activateRowOnKeyDown';
import type { TableCardProps } from '../types';
import { useVisibleCardsMaxHeight } from './useVisibleCardsMaxHeight';

export function TableCards<R>({
  cardClassName,
  maxVisibleCardCount,
  data,
  isFetching,
  rowKeyExtractor,
  rowOnClick,
  getRowHref,
  breakpoint,
  columns,
  order,
  onOrderChange,
  selectVariant = 'tertiary',
  controls,
  renderRowFooter,
  renderRowControl,
  hideCardDelimiter,
}: TableCardProps<R>) {
  const { t } = useTranslation();
  const cardListRef = useRef<HTMLDivElement>(null);
  const cardListMaxHeight = useVisibleCardsMaxHeight({
    cardListRef,
    cards: data,
    maxVisibleCardCount,
  });

  const [titleColumn, ...otherColumns] = columns;

  const selectOptions = columns.reduce((acc, column) => {
    if (!column.sortRows) {
      return acc;
    }

    const option: SelectOption = {
      value: column.key,
      label: column.selectOptionLabel,
    };

    return [...acc, option];
  }, [] as SelectOption[]);

  const selectedOption = order && selectOptions.find(option => option.value === order.orderBy.key);

  const handleOrderChange: SelectProps['onChange'] = value => {
    const newSelectedOption = selectOptions.find(option => option.value === value);
    const orderBy =
      newSelectedOption && columns.find(column => column.key === newSelectedOption.value);

    if (orderBy) {
      onOrderChange({
        orderBy,
        orderDirection: 'desc',
      });
    }
  };

  return (
    <div
      className={cn(
        breakpoint ? 'block' : 'hidden',
        breakpoint === 'xs' && 'xs:hidden',
        breakpoint === 'sm' && 'sm:hidden',
        breakpoint === 'md' && 'md:hidden',
        breakpoint === 'lg' && 'lg:hidden',
        breakpoint === 'xl' && 'xl:hidden',
        breakpoint === '2xl' && '2xl:hidden',
      )}
    >
      {controls && selectOptions.length > 0 && (
        <Select
          className="mb-4 hidden w-56 md:block"
          label={t('table.cardsSelect.label')}
          placeLabelToLeft
          options={selectOptions}
          value={selectedOption?.value || selectOptions[0].value}
          onChange={handleOrderChange}
          variant={selectVariant}
        />
      )}

      {isFetching && <Spinner className="mb-5" />}

      <div
        ref={cardListRef}
        className={cn('space-y-6', !!maxVisibleCardCount && 'relative overflow-y-auto')}
        style={{ maxHeight: cardListMaxHeight }}
      >
        {data.map((row, rowIndex) => {
          const rowKey = rowKeyExtractor(row);
          const content = (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="[&_p:first-child]:font-semibold">
                  {titleColumn.renderCell(row, rowIndex)}
                </div>

                {renderRowControl ? renderRowControl(row, rowIndex) : undefined}
              </div>

              {renderRowFooter ? renderRowFooter(row, rowIndex) : undefined}

              {!hideCardDelimiter && <Delimiter className="-mx-4 border-subtle" />}

              {otherColumns.map(column => (
                <LabeledInlineContent key={`${rowKey}-${column.key}`} label={column.label}>
                  <div className="text-right">{column.renderCell(row, rowIndex)}</div>
                </LabeledInlineContent>
              ))}
            </div>
          );

          return (
            <Card
              key={rowKey}
              className={cn(
                'border-raised bg-surface-popup backdrop-blur-raised',
                !!(rowOnClick || getRowHref) && 'cursor-pointer hover:bg-row-hover',
                cardClassName,
              )}
              onClick={rowOnClick && ((e: React.MouseEvent<HTMLDivElement>) => rowOnClick(e, row))}
              asChild
            >
              {getRowHref ? (
                <Link className="text-primary hover:no-underline" to={getRowHref(row)} noStyle>
                  {content}
                </Link>
              ) : (
                <div
                  role={rowOnClick ? 'button' : undefined}
                  tabIndex={rowOnClick ? 0 : undefined}
                  onKeyDown={rowOnClick ? activateRowOnKeyDown : undefined}
                >
                  {content}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default TableCards;
