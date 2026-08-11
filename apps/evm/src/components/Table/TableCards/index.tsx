import { Spinner, cn } from '@venusprotocol/ui';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { Card, LabeledInlineContent } from 'components';
import { Delimiter } from '../../Delimiter';
import { Select, type SelectOption, type SelectProps } from '../../Select';
import type { TableCardProps } from '../types';

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
          className="mb-4 hidden w-56 sm:block"
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
