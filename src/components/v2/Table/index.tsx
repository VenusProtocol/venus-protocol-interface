/** @jsxImportSource @emotion/react */
import React, { useMemo, useState } from 'react';
import TableMUI from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { uid } from 'react-uid';
import Head from './Head';
import { useStyles } from './styles';

interface ITableRowProps {
  key: string | number;
  render: () => React.ReactNode | string;
  value: string | number | boolean;
}

export interface ITableProps {
  title?: string;
  data: ITableRowProps[][];
  columns: { key: string; label: string; orderable: boolean }[];
  rowKeyIndex: number;
  minWidth?: string;
  initialOrder?: {
    orderBy: string;
    orderDirection: 'asc' | 'desc';
  };
  rowOnClick?: (e: React.MouseEvent<HTMLDivElement>, row: ITableRowProps[]) => void;
  className?: string;
  gridTemplateColumns?: string;
}

export const Table = ({
  columns,
  data,
  title,
  minWidth,
  initialOrder,
  rowOnClick,
  rowKeyIndex,
  className,
  gridTemplateColumns,
}: ITableProps) => {
  const styles = useStyles();
  const [orderBy, setOrderBy] = useState<typeof columns[number]['key'] | undefined>(
    initialOrder?.orderBy,
  );
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc' | undefined>(
    initialOrder?.orderDirection,
  );
  const onRequestOrder = (property: typeof columns[number]['key']) => {
    let newOrder: 'asc' | 'desc' = 'asc';
    if (property === orderBy) {
      newOrder = orderDirection === 'asc' ? 'desc' : 'asc';
    }
    setOrderBy(property);
    setOrderDirection(newOrder);
  };

  const rows = React.useMemo(() => {
    // order in place
    if (!orderBy) {
      return data;
    }
    const rowIndex = columns.findIndex(column => column.key === orderBy);
    const newRows = [...data];
    newRows.sort((a, b) => {
      if (+a[rowIndex].value < +b[rowIndex].value) {
        return orderDirection === 'asc' ? -1 : 1;
      }
      if (+a[rowIndex].value > +b[rowIndex].value) {
        return orderDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return newRows;
  }, [data, orderBy, orderDirection]);

  /* gridStyles provides grid-template-columns styles for rows in rows for thead and tbody */
  const gridStyles =
    gridTemplateColumns ||
    useMemo(
      () =>
        /* if gridTemplateColumns prop is not passed from parent component, we create similar fractions by default */
        columns.map(() => '1fr').join(' '),
      [columns],
    );

  return (
    <div className={className}>
      {title && <h4 css={styles.title}>{title}</h4>}

      <TableContainer css={styles.tableContainer} component={Paper}>
        <TableMUI css={styles.table({ minWidth: minWidth ?? '0' })} aria-label={title}>
          <Head
            columns={columns}
            orderBy={orderBy}
            orderDirection={orderDirection}
            onRequestOrder={onRequestOrder}
            css={styles.getTemplateColumns({ gridStyles })}
          />

          {/* TODO: add loading state */}

          {/* TODO: add error state */}

          <TableBody>
            {rows.map(row => (
              <TableRow
                hover
                key={row[rowKeyIndex].value.toString()}
                onClick={e => rowOnClick && rowOnClick(e, row)}
                css={styles.getTemplateColumns({ gridStyles })}
              >
                {row.map(({ key, render }: ITableRowProps) => {
                  const cellContent = render();
                  const cellTitle = typeof cellContent === 'string' ? cellContent : undefined;
                  return (
                    <TableCell css={styles.cellWrapper} key={uid(key)} title={cellTitle}>
                      {cellContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </TableMUI>
      </TableContainer>
    </div>
  );
};
