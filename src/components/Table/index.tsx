/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableRow from '@mui/material/TableRow';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Spinner } from '../Spinner';
import Head from './Head';
import TableCards from './TableCards';
import { useStyles } from './styles';
import { TableColumn, TableProps } from './types';

export * from './types';

export function Table<R>({
  columns,
  cardColumns,
  data,
  title,
  minWidth,
  initialOrder,
  rowOnClick,
  getRowHref,
  rowKeyExtractor,
  className,
  breakpoint,
  isFetching,
}: TableProps<R>) {
  const styles = useStyles();

  const [order, setOrder] = React.useState<
    | {
        orderBy: TableColumn<R>;
        orderDirection: 'asc' | 'desc';
      }
    | undefined
  >(initialOrder);

  const onRequestOrder = (column: TableColumn<R>) => {
    let newOrderDirection: 'asc' | 'desc' = 'desc';

    if (column.key === order?.orderBy.key) {
      newOrderDirection = order?.orderDirection === 'asc' ? 'desc' : 'asc';
    }

    setOrder({
      orderBy: column,
      orderDirection: newOrderDirection,
    });
  };

  const sortedData = useMemo(() => {
    if (!order || !order.orderBy.sortRows) {
      return data;
    }

    return [...data].sort((rowA, rowB) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      order.orderBy.sortRows!(rowA, rowB, order.orderDirection),
    );
  }, [data, order]);

  return (
    <Paper css={styles.getRoot({ breakpoint })} className={className}>
      {title && <h4 css={styles.getTitle({ breakpoint })}>{title}</h4>}

      {isFetching && <Spinner css={styles.loader} />}

      <MuiTableContainer css={styles.getTableContainer({ breakpoint })}>
        <MuiTable css={styles.table({ minWidth: minWidth ?? '0' })} aria-label={title}>
          <Head
            columns={columns}
            orderBy={order?.orderBy}
            orderDirection={order?.orderDirection}
            onRequestOrder={onRequestOrder}
          />

          <MuiTableBody>
            {sortedData.map((row, rowIndex) => {
              const rowKey = rowKeyExtractor(row);

              return (
                <MuiTableRow
                  hover
                  key={rowKey}
                  css={styles.getTableRow({ clickable: !!rowOnClick })}
                  onClick={
                    !getRowHref && rowOnClick
                      ? (e: React.MouseEvent<HTMLDivElement>) => rowOnClick(e, row)
                      : undefined
                  }
                >
                  {columns.map(column => {
                    const cellContent = column.renderCell(row, rowIndex);
                    const cellTitle = typeof cellContent === 'string' ? cellContent : undefined;

                    return (
                      <MuiTableCell
                        css={styles.getCellWrapper({ containsLink: !!getRowHref })}
                        key={`${rowKey}-${column.key}`}
                        title={cellTitle}
                        align={column.align}
                      >
                        {getRowHref ? <Link to={getRowHref(row)}>{cellContent}</Link> : cellContent}
                      </MuiTableCell>
                    );
                  })}
                </MuiTableRow>
              );
            })}
          </MuiTableBody>
        </MuiTable>
      </MuiTableContainer>

      <TableCards
        data={data}
        rowKeyExtractor={rowKeyExtractor}
        rowOnClick={rowOnClick}
        getRowHref={getRowHref}
        columns={cardColumns || columns}
        breakpoint={breakpoint}
      />
    </Paper>
  );
}
