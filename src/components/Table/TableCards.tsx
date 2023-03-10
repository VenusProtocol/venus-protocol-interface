/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';

import { Delimiter } from '../Delimiter';
import { Select, Option as SelectOption, SelectProps } from '../Select';
import { useStyles } from './styles';
import { Order, TableColumn, TableRowProps } from './types';

interface TableCardProps<R> {
  rows: TableRowProps[][];
  rowKeyIndex: number;
  columns: TableColumn<R>[];
  className?: string;
  rowOnClick?: (e: React.MouseEvent<HTMLDivElement>, row: TableRowProps[]) => void;
  getRowHref?: (row: TableRowProps[]) => string;
  order: Order | undefined;
  onOrderChange: (newOrder: Order) => void;
}

function TableCards<R>({
  rows,
  rowKeyIndex,
  rowOnClick,
  getRowHref,
  columns,
  className,
  order,
  onOrderChange,
}: TableCardProps<R>) {
  const { t } = useTranslation();
  const styles = useStyles();

  const selectOptions = useMemo(
    () =>
      columns.reduce((acc, column) => {
        if (!column.sortRows) {
          return acc;
        }

        const option: SelectOption = {
          value: column.key,
          label: column.label,
        };

        return [...acc, option];
      }, [] as SelectOption[]),
    [columns],
  );

  const selectedOption = useMemo(
    () => (order ? selectOptions.find(option => option.value === order.orderBy) : selectOptions[1]),
    [order, selectOptions],
  );

  const handleOrderChange: SelectProps['onChange'] = selectChangeEvent => {
    const newSelectedOption = selectOptions.find(
      option => option.value === selectChangeEvent.target.value,
    );
    const orderBy =
      newSelectedOption && columns.find(column => column.key === newSelectedOption.value);

    if (orderBy) {
      onOrderChange({
        orderBy: orderBy.key,
        orderDirection: 'desc',
      });
    }
  };

  return (
    <>
      {selectOptions.length > 0 && (
        <div css={styles.cardsSelectContainer}>
          <Select
            label={t('table.cardsSelect.label')}
            ariaLabel={t('table.cardsSelect.accessibilityLabel')}
            options={selectOptions}
            value={selectedOption?.value}
            onChange={handleOrderChange}
            css={styles.cardsSelect}
            placeLabelToLeft
          />
        </div>
      )}

      <div className={className}>
        {rows.map((row, idx) => {
          const rowKey = `${row[rowKeyIndex].value.toString()}-${idx}-cards`;
          const [titleColumn, ...otherColumns] = columns;
          const titleCell = row.find(cell => titleColumn.key === cell.key);
          return (
            <Paper
              key={rowKey}
              css={styles.tableWrapperMobile({ clickable: !!(rowOnClick || getRowHref) })}
              onClick={rowOnClick && ((e: React.MouseEvent<HTMLDivElement>) => rowOnClick(e, row))}
              component={
                getRowHref
                  ? ({ children, ...props }) => (
                      <div {...props}>
                        <Link to={getRowHref(row)}>{children}</Link>
                      </div>
                    )
                  : 'div'
              }
            >
              <div css={styles.rowTitleMobile}>{titleCell?.render()}</div>
              <Delimiter css={styles.delimiterMobile} />
              <div className="table__table-cards__card-content" css={styles.rowWrapperMobile}>
                {otherColumns.map(column => {
                  const currentCell = row.find(cell => column.key === cell.key);
                  return (
                    <div key={`${rowKey}-${currentCell?.key}`} css={styles.cellMobile}>
                      <Typography variant="body2" css={styles.columnLabelMobile}>
                        {column?.label}
                      </Typography>
                      <div css={styles.cellValueMobile}>{currentCell?.render()}</div>
                    </div>
                  );
                })}
              </div>
            </Paper>
          );
        })}
      </div>
    </>
  );
}

export default TableCards;
