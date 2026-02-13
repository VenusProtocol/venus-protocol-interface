import { useMemo } from 'react';

import { Spinner, cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';

import { Select, type SelectOption, type SelectProps } from 'components/Select';
import type { TableCardProps } from '../types';
import { MarketCard } from './MarketCard';

export function TableCards<R>({
  cardClassName,
  data,
  isFetching,
  rowKeyExtractor,
  rowOnClick,
  getRowHref,
  breakpoint,
  columns,
  order,
  onOrderChange,
  showMobileFilter = true,
  rowControlOnClick,
  selectVariant = 'tertiary',
}: TableCardProps<R>) {
  const { t } = useTranslation();

  const selectOptions = useMemo(
    () =>
      columns.reduce((acc, column) => {
        if (!column.sortRows) {
          return acc;
        }

        const option: SelectOption = {
          value: column.key,
          label: column.selectOptionLabel,
        };

        return [...acc, option];
      }, [] as SelectOption[]),
    [columns],
  );

  const selectedOption = useMemo(
    () => order && selectOptions.find(option => option.value === order.orderBy.key),
    [order, selectOptions],
  );

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
    <div className={cn(!breakpoint && 'hidden', breakpoint && `block ${breakpoint}:hidden`)}>
      {showMobileFilter && selectOptions.length > 0 && (
        <Select
          label={t('table.cardsSelect.label')}
          placeLabelToLeft
          options={selectOptions}
          value={selectedOption?.value || selectOptions[0].value}
          onChange={handleOrderChange}
          className="mb-4 w-56"
          variant={selectVariant}
        />
      )}

      {isFetching && <Spinner className="mb-5" />}

      <div className="space-y-3">
        {data.map((row, rowIndex) => (
          <MarketCard
            key={rowKeyExtractor(row)}
            index={rowIndex}
            row={row}
            onClick={rowOnClick}
            onControlClick={rowControlOnClick}
            className={cardClassName}
            columns={columns}
            href={getRowHref?.(row)}
          />
        ))}
      </div>
    </div>
  );
}
