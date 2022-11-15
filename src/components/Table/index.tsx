/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import TableMUI from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { Link } from 'react-router-dom';

import { BREAKPOINTS } from 'theme/MuiThemeProvider/muiTheme';

import { Spinner } from '../Spinner';
import Head from './Head';
import TableCards from './TableCards';
import { useStyles } from './styles';

export interface TableRowProps {
  key: string | number;
  render: () => React.ReactNode | string;
  value: string | number | boolean;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps {
  title?: string;
  data: TableRowProps[][];
  rowKeyExtractor: (row: TableRowProps[]) => string;
  breakpoint: keyof typeof BREAKPOINTS['values'];
  columns: { key: string; label: string; orderable: boolean }[];
  cardColumns?: { key: string; label: string; orderable: boolean }[];
  minWidth?: string;
  initialOrder?: {
    orderBy: string;
    orderDirection: 'asc' | 'desc';
  };
  className?: string;
  gridTemplateColumnsCards?: string;
  gridTemplateRowsMobile?: string /* used for mobile view if table has to display more than 1 row */;
  isFetching?: boolean;
  rowOnClick?: (e: React.MouseEvent<HTMLDivElement>, row: TableRowProps[]) => void;
  getRowHref?: (row: TableRowProps[]) => string;
}

export const Table = ({
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
}: TableProps) => {
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
      const formattedValueA = Number.isNaN(+a[rowIndex]?.value)
        ? a[rowIndex]?.value
        : +a[rowIndex]?.value;
      const formattedValueB = Number.isNaN(+b[rowIndex]?.value)
        ? b[rowIndex]?.value
        : +b[rowIndex]?.value;

      if (formattedValueA < formattedValueB) {
        return orderDirection === 'asc' ? -1 : 1;
      }
      if (formattedValueA > formattedValueB) {
        return orderDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return newRows;
  }, [data, orderBy, orderDirection]);

  return (
    <Paper css={styles.getRoot({ breakpoint })} className={className}>
      {title && <h4 css={styles.getTitle({ breakpoint })}>{title}</h4>}

      {isFetching && <Spinner css={styles.loader} />}

      <TableContainer css={styles.getTableContainer({ breakpoint })}>
        <TableMUI css={styles.table({ minWidth: minWidth ?? '0' })} aria-label={title}>
          <Head
            columns={columns}
            orderBy={orderBy}
            orderDirection={orderDirection}
            onRequestOrder={onRequestOrder}
          />

          <TableBody>
            {rows.map(row => {
              const rowKey = rowKeyExtractor(row);

              return (
                <TableRow
                  hover
                  key={rowKey}
                  css={styles.getTableRow({ clickable: !!rowOnClick })}
                  onClick={
                    !getRowHref && rowOnClick
                      ? (e: React.MouseEvent<HTMLDivElement>) => rowOnClick(e, row)
                      : undefined
                  }
                >
                  {row.map(({ key, render, align }: TableRowProps) => {
                    const cellContent = render();
                    const cellTitle = typeof cellContent === 'string' ? cellContent : undefined;

                    return (
                      <TableCell
                        css={styles.getCellWrapper({ containsLink: !!getRowHref })}
                        key={`${rowKey}-${key}`}
                        title={cellTitle}
                        align={align}
                      >
                        {getRowHref ? <Link to={getRowHref(row)}>{cellContent}</Link> : cellContent}
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
        rowKeyExtractor={rowKeyExtractor}
        rowOnClick={rowOnClick}
        getRowHref={getRowHref}
        columns={cardColumns || columns}
        breakpoint={breakpoint}
      />
    </Paper>
  );
};
