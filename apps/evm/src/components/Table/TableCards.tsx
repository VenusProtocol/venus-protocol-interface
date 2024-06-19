/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useMemo } from 'react';

import { Spinner } from 'components/Spinner';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { Card } from 'components';
import { Delimiter } from '../Delimiter';
import { Select, type SelectOption, type SelectProps } from '../Select';
import { useStyles } from './styles';
import type { Order, TableProps } from './types';

interface TableCardProps<R>
  extends Pick<
    TableProps<R>,
    | 'data'
    | 'rowKeyExtractor'
    | 'rowOnClick'
    | 'getRowHref'
    | 'breakpoint'
    | 'columns'
    | 'isFetching'
  > {
  order: Order<R> | undefined;
  onOrderChange: (newOrder: Order<R>) => void;
}

export function TableCards<R>({
  data,
  isFetching,
  rowKeyExtractor,
  rowOnClick,
  getRowHref,
  breakpoint,
  columns,
  order,
  onOrderChange,
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
      {selectOptions.length > 0 && (
        <Select
          label={t('table.cardsSelect.label')}
          placeLabelToLeft
          options={selectOptions}
          value={selectedOption?.value || selectOptions[0].value}
          onChange={handleOrderChange}
          css={styles.cardsSelect}
          variant="secondary"
        />
      )}

      {isFetching && <Spinner css={styles.loader} />}

      <div>
        {data.map((row, rowIndex) => {
          const rowKey = rowKeyExtractor(row);
          const content = (
            <>
              <div css={styles.rowTitleMobile}>{titleColumn.renderCell(row, rowIndex)}</div>

              <Delimiter css={styles.delimiterMobile} />

              <div className="table__table-cards__card-content" css={styles.rowWrapperMobile}>
                {otherColumns.map(column => (
                  <div key={`${rowKey}-${column.key}`} css={styles.cellMobile}>
                    <Typography variant="tiny" css={styles.cellTitleMobile}>
                      {column.label}
                    </Typography>

                    <Typography variant="small2" css={styles.cellValueMobile}>
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
              css={styles.tableWrapperMobile({ clickable: !!(rowOnClick || getRowHref) })}
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
