/** @jsxImportSource @emotion/react */
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableRow from '@mui/material/TableRow';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import { useFormatTo } from 'hooks/useFormatTo';

import { Spinner, cn } from '@venusprotocol/ui';
import { useBreakpointUp } from 'hooks/responsive';
import { Card } from '../Card';
import Head from './Head';
import TableCards from './TableCards';
import { useStyles } from './styles';
import type { Order, TableColumn, TableProps } from './types';

export * from './types';

export function Table<R>({
  columns,
  cardClassName,
  cardColumns,
  data,
  title,
  minWidth,
  initialOrder,
  rowOnClick,
  getRowHref,
  rowKeyExtractor,
  breakpoint,
  isFetching,
  header,
  placeholder,
  selectVariant,
  ...otherProps
}: TableProps<R>) {
  const styles = useStyles();
  const { formatTo } = useFormatTo();

  // The fallback breakpoint is just to satisfy TS here, it is not actually used
  const _isBreakpointUp = useBreakpointUp(breakpoint || 'xxl');
  const isBreakpointUp = !!breakpoint && _isBreakpointUp;

  const [order, setOrder] = useState<Order<R> | undefined>(initialOrder);

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
      order.orderBy.sortRows!(rowA, rowB, order.orderDirection),
    );
  }, [data, order]);

  return (
    <Card css={styles.getRoot({ breakpoint })} {...otherProps}>
      {title && (
        <div css={styles.getTitle({ breakpoint })} className="text-lg h-8">
          {title}
        </div>
      )}

      {!!header && (
        <div
          css={styles.getHeader({ breakpoint })}
          className={cn('mb-4', isBreakpointUp && 'mb-0')}
        >
          {header}
        </div>
      )}

      {data.length > 0 || !placeholder ? (
        <>
          <MuiTableContainer css={styles.getTableContainer({ breakpoint })}>
            <MuiTable css={styles.table({ minWidth: minWidth ?? '0' })}>
              <Head
                columns={columns}
                orderBy={order?.orderBy}
                orderDirection={order?.orderDirection}
                onRequestOrder={onRequestOrder}
              />

              {isFetching && (
                <tbody>
                  <tr>
                    <td colSpan={columns.length}>
                      <Spinner css={styles.loader} />
                    </td>
                  </tr>
                </tbody>
              )}

              <MuiTableBody>
                {sortedData.map((row, rowIndex) => {
                  const rowKey = rowKeyExtractor(row);

                  const additionalProps = getRowHref
                    ? {
                        component: Link,
                        to: formatTo({ to: getRowHref(row) }),
                      }
                    : {};

                  return (
                    <MuiTableRow
                      hover
                      key={rowKey}
                      css={[
                        styles.link,
                        styles.getTableRow({ clickable: !!getRowHref || !!rowOnClick }),
                      ]}
                      onClick={
                        rowOnClick
                          ? (e: React.MouseEvent<HTMLDivElement>) => rowOnClick(e, row)
                          : undefined
                      }
                      {...additionalProps}
                    >
                      {columns.map(column => {
                        const cellContent = column.renderCell(row, rowIndex);
                        const cellTitle = typeof cellContent === 'string' ? cellContent : undefined;

                        return (
                          <MuiTableCell
                            css={styles.cellWrapper}
                            key={`${rowKey}-${column.key}`}
                            title={cellTitle}
                            align={column.align}
                          >
                            {cellContent}
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
            cardClassName={cardClassName}
            selectVariant={selectVariant}
            data={sortedData}
            isFetching={isFetching}
            rowKeyExtractor={rowKeyExtractor}
            rowOnClick={rowOnClick}
            getRowHref={getRowHref}
            columns={cardColumns || columns}
            breakpoint={breakpoint}
            order={order}
            onOrderChange={setOrder}
          />
        </>
      ) : (
        placeholder
      )}
    </Card>
  );
}
