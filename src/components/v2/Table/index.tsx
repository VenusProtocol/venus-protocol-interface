/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
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
  title: string;
  data: ITableRowProps[][];
  columns: { key: string; label: string; orderable: boolean }[];
  minWidth?: string;
  initialOrder?: {
    orderBy: string;
    orderDirection: 'asc' | 'desc';
  };
}

export function Table({ columns, data, title, minWidth, initialOrder }: ITableProps) {
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

  return (
    <TableContainer css={styles.tableContainer} component={Paper}>
      <h4 css={styles.title}>{title}</h4>
      <TableMUI css={styles.table({ minWidth: minWidth ?? '0' })} aria-label={title}>
        <Head
          columns={columns}
          orderBy={orderBy}
          orderDirection={orderDirection}
          onRequestOrder={onRequestOrder}
        />
        <TableBody>
          {rows.map(row => (
            <TableRow key={uid(row)}>
              {row.map(({ key, render }: ITableRowProps) => (
                <TableCell key={uid(key)}>{render()}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableMUI>
    </TableContainer>
  );
}
