/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useMemo } from 'react';

import { Spinner, cn } from '@venusprotocol/ui';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { Card } from 'components';
import { Delimiter } from '../Delimiter';
import { Select, type SelectOption, type SelectProps } from '../Select';
import { useStyles } from './styles';
import type { TableCardProps } from './types';

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
  selectVariant = 'tertiary',
}: TableCardProps<R>) {
  const { t } = useTranslation();
  const styles = useStyles();

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
    <div css={styles.getCardsContainer({ breakpoint })}>
      {showMobileFilter && selectOptions.length > 0 && (
        <Select
          label={t('table.cardsSelect.label')}
          placeLabelToLeft
          options={selectOptions}
          value={selectedOption?.value || selectOptions[0].value}
          onChange={handleOrderChange}
          css={styles.cardsSelect}
          variant={selectVariant}
        />
      )}

      {isFetching && <Spinner css={styles.loader} />}

      <div className="space-y-4">
        {data.map((row, rowIndex) => {
          const rowKey = rowKeyExtractor(row);
          const content = (
            <>
              <div>{titleColumn.renderCell(row, rowIndex)}</div>

              <Delimiter className="my-4" />

              <div className="table-card-content grid grid-rows-1 gap-8">
                {otherColumns.map(column => (
                  <div
                    key={`${rowKey}-${column.key}`}
                    className="table-card-content-row flex flex-col"
                  >
                    <Typography
                      variant="tiny"
                      css={styles.cellTitleMobile}
                      className="table-card-content-row-label"
                    >
                      {column.label}
                    </Typography>

                    <Typography
                      variant="small2"
                      css={styles.cellValueMobile}
                      className="table-card-content-row-value"
                    >
                      {column.renderCell(row, rowIndex)}
                    </Typography>
                  </div>
                ))}
              </div>
            </>
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
                <Link css={styles.link} to={getRowHref(row)}>
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
