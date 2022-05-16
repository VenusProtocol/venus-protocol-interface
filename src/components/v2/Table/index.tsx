/** @jsxImportSource @emotion/react */
import React from 'react';
import { SerializedStyles } from '@emotion/react';
import TableMUI from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Head from './Head';
import { useStyles } from './styles';
import TableCards from './TableCards';

export interface ITableRowProps {
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
  tableCss?: SerializedStyles;
  cardsCss?: SerializedStyles;
  gridTemplateColumnsCards?: string;
  gridTemplateRowsMobile?: string /* used for mobile view if table has to display more than 1 row */;
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
  tableCss,
  cardsCss,
}: ITableProps) => {
  const styles = useStyles();

  const [orderBy, setOrderBy] = React.useState<typeof columns[number]['key'] | undefined>(
    initialOrder?.orderBy,
  );

  const [orderDirection, setOrderDirection] = React.useState<'asc' | 'desc' | undefined>(
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
    <Paper css={styles.root} className={className}>
      {title && <h4 css={styles.title}>{title}</h4>}
      <TableContainer css={tableCss}>
        <TableMUI css={styles.table({ minWidth: minWidth ?? '0' })} aria-label={title}>
          <Head
            columns={columns}
            orderBy={orderBy}
            orderDirection={orderDirection}
            onRequestOrder={onRequestOrder}
          />

          {/* TODO: add loading state */}

          {/* TODO: add error state */}

          <TableBody>
            {rows.map(row => {
              const rowKey = row[rowKeyIndex].value.toString();

              return (
                <TableRow hover key={rowKey} onClick={e => rowOnClick && rowOnClick(e, row)}>
                  {row.map(({ key, render }: ITableRowProps) => {
                    const cellContent = render();
                    const cellTitle = typeof cellContent === 'string' ? cellContent : undefined;
                    return (
                      <TableCell
                        css={styles.cellWrapper}
                        key={`${rowKey}-${key}`}
                        title={cellTitle}
                      >
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </TableMUI>
      </TableContainer>
      <TableCards
        rows={rows}
        rowKeyIndex={rowKeyIndex}
        rowOnClick={rowOnClick}
        columns={columns}
        css={cardsCss}
      />
    </Paper>
  );
};
