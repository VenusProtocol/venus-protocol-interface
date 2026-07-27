import { useMemo } from 'react';

import { Spinner, cn } from '@venusprotocol/ui';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { Card, LabeledInlineContent } from 'components';
import { Delimiter } from '../../Delimiter';
import { Select, type SelectOption, type SelectProps } from '../../Select';
import type { TableCardProps } from '../types';

const cardsContainerBreakpointClassNames = {
  xs: 'block xs:hidden',
  sm: 'block sm:hidden',
  md: 'block md:hidden',
  lg: 'block lg:hidden',
  xl: 'block xl:hidden',
  '2xl': 'block 2xl:hidden',
};

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
  selectVariant = 'tertiary',
  controls,
  renderRowFooter,
  renderRowControl,
  hideCardDelimiter,
}: TableCardProps<R>) {
  const { t } = useTranslation();

  const [titleColumn, ...otherColumns] = columns;

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
    <div
      className={cn(
        !breakpoint && 'hidden',
        breakpoint && cardsContainerBreakpointClassNames[breakpoint],
      )}
    >
      {controls && selectOptions.length > 0 && (
        <Select
          className="mb-4 w-56 max-sm:hidden"
          label={t('table.cardsSelect.label')}
          placeLabelToLeft
          options={selectOptions}
          value={selectedOption?.value || selectOptions[0].value}
          onChange={handleOrderChange}
          variant={selectVariant}
        />
      )}

      {isFetching && <Spinner className="mb-5" />}

      <div className="space-y-6">
        {data.map((row, rowIndex) => {
          const rowKey = rowKeyExtractor(row);
          const content = (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>{titleColumn.renderCell(row, rowIndex)}</div>

                {renderRowControl ? renderRowControl(row, rowIndex) : undefined}
              </div>

              {renderRowFooter ? renderRowFooter(row, rowIndex) : undefined}

              {!hideCardDelimiter && <Delimiter />}

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
                !!(rowOnClick || getRowHref) && 'cursor-pointer hover:bg-cards',
                cardClassName,
              )}
              onClick={rowOnClick && ((e: React.MouseEvent<HTMLDivElement>) => rowOnClick(e, row))}
              asChild
            >
              {getRowHref ? (
                <Link className="text-white hover:no-underline" to={getRowHref(row)} noStyle>
                  {content}
                </Link>
              ) : (
                <div>{content}</div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default TableCards;
