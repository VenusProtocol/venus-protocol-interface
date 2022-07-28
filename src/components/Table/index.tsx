/** @jsxImportSource @emotion/react */
import { SerializedStyles } from '@emotion/react';
import Paper from '@mui/material/Paper';
import TableMUI from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { Link } from 'react-router-dom';

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

export interface TableBaseProps {
  title?: string;
  data: TableRowProps[][];
  columns: { key: string; label: string; orderable: boolean }[];
  cardColumns?: { key: string; label: string; orderable: boolean }[];
  rowKeyIndex: number;
  minWidth?: string;
  initialOrder?: {
    orderBy: string;
    orderDirection: 'asc' | 'desc';
  };
  rowOnClick?: (e: React.MouseEvent<HTMLDivElement>, row: TableRowProps[]) => void;
  className?: string;
  tableCss?: SerializedStyles;
  cardsCss?: SerializedStyles;
  gridTemplateColumnsCards?: string;
  gridTemplateRowsMobile?: string /* used for mobile view if table has to display more than 1 row */;
  isFetching?: boolean;
}

interface TableCardRowOnClickProps extends TableBaseProps {
  rowOnClick?: (e: React.MouseEvent<HTMLDivElement>, row: TableRowProps[]) => void;
  getRowHref?: undefined;
}

interface TableCardHrefProps extends TableBaseProps {
  rowOnClick?: undefined;
  getRowHref?: (row: TableRowProps[]) => string;
}

export type TableProps = TableCardRowOnClickProps | TableCardHrefProps;

export const Table = ({
  columns,
  cardColumns,
  data,
  title,
  minWidth,
  initialOrder,
  rowOnClick,
  getRowHref,
  rowKeyIndex,
  className,
  tableCss,
  cardsCss,
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
    <Paper css={styles.root} className={className}>
      {title && <h4 css={styles.title}>{title}</h4>}

      {isFetching && <Spinner css={styles.loader} />}

      <TableContainer css={tableCss}>
        <TableMUI css={styles.table({ minWidth: minWidth ?? '0' })} aria-label={title}>
          <Head
            columns={columns}
            orderBy={orderBy}
            orderDirection={orderDirection}
            onRequestOrder={onRequestOrder}
          />

          <TableBody>
            {rows.map((row, idx) => {
              const rowKey = `${row[rowKeyIndex].value.toString()}-${idx}-table`;
              return (
                <TableRow
                  hover
                  key={rowKey}
                  css={styles.getTableRow({ clickable: !!rowOnClick })}
                  onClick={
                    rowOnClick && ((e: React.MouseEvent<HTMLDivElement>) => rowOnClick(e, row))
                  }
                >
                  {row.map(({ key, render, align }: TableRowProps) => {
                    const cellContent = render();
                    const cellTitle = typeof cellContent === 'string' ? cellContent : undefined;
                    return (
                      <TableCell
                        css={styles.getCellWrapper({ containsLink: !!getRowHref })}
                        key={`${rowKey}-${key}-table`}
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
        rowKeyIndex={rowKeyIndex}
        rowOnClick={rowOnClick}
        getRowHref={getRowHref}
        columns={cardColumns || columns}
        css={cardsCss}
      />
    </Paper>
  );
};
