import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableRow from '@mui/material/TableRow';
import { Spinner, cn } from '@venusprotocol/ui';
import { Fragment, useMemo, useState } from 'react';
import { Link } from 'react-router';

import { useFormatTo } from 'hooks/useFormatTo';

import { Card } from 'components/Card';
import { useBreakpointUp } from 'hooks/responsive';
import Head from './Head';
import { TableCards } from './TableCards';
import type { Order, TableColumn, TableProps } from './types';

export * from './types';

export function Table<R>({
  controls = true,
  columns,
  cardClassName,
  cardColumns,
  data,
  title,
  minWidth,
  initialOrder,
  order: orderProp,
  onOrderChange,
  rowOnClick,
  getRowHref,
  rowKeyExtractor,
  breakpoint,
  isFetching,
  size = 'md',
  header,
  placeholder,
  selectVariant,
  cellHeight,
  variant = 'primary',
  tableLayout = 'fixed',
  renderRowFooter,
  renderRowControl,
  hideCardDelimiter,
  className,
  ...otherProps
}: TableProps<R>) {
  const { formatTo } = useFormatTo();
  const totalColumns = columns.length + (renderRowControl ? 1 : 0);

  let tableCellHeight = cellHeight ?? '1px';

  if (typeof cellHeight === 'number') {
    tableCellHeight = `${cellHeight}px`;
  }

  // The fallback breakpoint is just to satisfy TS here, it is not actually used
  const _isBreakpointUp = useBreakpointUp(breakpoint || '2xl');
  const isBreakpointUp = !!breakpoint && _isBreakpointUp;

  const [internalOrder, setInternalOrder] = useState<Order<R> | undefined>(initialOrder);
  const order = orderProp ?? internalOrder;

  const updateOrder = (newOrder: Order<R>) => {
    if (orderProp === undefined) {
      setInternalOrder(newOrder);
    }

    onOrderChange?.(newOrder);
  };

  const onRequestOrder = (column: TableColumn<R>) => {
    let newOrderDirection: 'asc' | 'desc' = 'desc';

    if (column.key === order?.orderBy.key) {
      newOrderDirection = order?.orderDirection === 'asc' ? 'desc' : 'asc';
    }

    updateOrder({ orderBy: column, orderDirection: newOrderDirection });
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
    <Card
      className={cn('p-0', breakpoint && !isBreakpointUp && 'bg-transparent border-0', className)}
      {...otherProps}
    >
      {title && (
        <div
          className={cn(
            'mb-2 h-8 px-4 text-lg',
            breakpoint === 'xs' && 'max-xs:px-0',
            breakpoint === 'sm' && 'max-sm:px-0',
            breakpoint === 'md' && 'max-md:px-0',
            breakpoint === 'lg' && 'max-lg:px-0',
            breakpoint === 'xl' && 'max-xl:px-0',
            breakpoint === '2xl' && 'max-2xl:px-0',
          )}
        >
          {title}
        </div>
      )}

      {!!header && <div className={cn('mb-4', isBreakpointUp && 'mb-0 p-4')}>{header}</div>}

      {data.length > 0 || !placeholder ? (
        <>
          <MuiTableContainer
            className={cn(
              breakpoint === 'xs' && 'hidden xs:block',
              breakpoint === 'sm' && 'hidden sm:block',
              breakpoint === 'md' && 'hidden md:block',
              breakpoint === 'lg' && 'hidden lg:block',
              breakpoint === 'xl' && 'hidden xl:block',
              breakpoint === '2xl' && 'hidden 2xl:block',
            )}
          >
            <MuiTable
              className="[&_.MuiTableCell-root]:border-0! [&_.MuiTableCell-root]:font-normal! [&_.MuiTableCell-root]:flex-row [&_.MuiTableCell-root]:text-[14px]! [&_.MuiTableCell-root]:normal-case [&_.MuiTableCell-root:first-of-type]:pl-4! [&_.MuiTableCell-root:last-child]:pr-4!"
              sx={{ minWidth: minWidth ?? '0', tableLayout }}
            >
              <Head
                className={cn(variant === 'primary' && 'border-b border-dark-blue-hover')}
                controls={controls}
                columns={columns}
                orderBy={order?.orderBy}
                orderDirection={order?.orderDirection}
                onRequestOrder={onRequestOrder}
                rowControlColumn={!!renderRowControl}
              />

              {isFetching && (
                <tbody>
                  <tr>
                    <td colSpan={totalColumns}>
                      <Spinner className="my-5" />
                    </td>
                  </tr>
                </tbody>
              )}

              <MuiTableBody>
                {sortedData.map((row, rowIndex) => {
                  const rowKey = rowKeyExtractor(row);
                  const rowFooter = renderRowFooter?.(row, rowIndex);

                  const additionalProps = getRowHref
                    ? {
                        component: Link,
                        to: formatTo({ to: getRowHref(row) }),
                      }
                    : {};

                  return (
                    <Fragment key={rowKey}>
                      <MuiTableRow
                        className={cn(
                          'h-18 text-white hover:no-underline [&:hover:not(:has(button:hover))]:bg-background-hover! [&:hover:not(:has(button:hover))]:overflow-hidden',
                          (!!getRowHref || !!rowOnClick) && 'cursor-pointer',
                          variant === 'secondary' &&
                            '[&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg',
                        )}
                        onClick={
                          rowOnClick
                            ? (e: React.MouseEvent<HTMLDivElement>) => rowOnClick(e, row)
                            : undefined
                        }
                        {...additionalProps}
                      >
                        {columns.map(column => {
                          const cellContent = column.renderCell(row, rowIndex);
                          const cellTitle =
                            typeof cellContent === 'string' ? cellContent : undefined;

                          return (
                            <MuiTableCell
                              className="overflow-hidden text-ellipsis px-4! py-0! [&:first-of-type>a]:pl-0 [&:last-of-type>a]:pr-0"
                              sx={{ height: tableCellHeight }}
                              key={`${rowKey}-${column.key}`}
                              title={cellTitle}
                              align={column.align}
                            >
                              {cellContent}
                            </MuiTableCell>
                          );
                        })}

                        {renderRowControl && (
                          <MuiTableCell className="align-middle">
                            {renderRowControl(row, rowIndex)}
                          </MuiTableCell>
                        )}
                      </MuiTableRow>

                      {rowFooter !== undefined && rowFooter !== null && (
                        <MuiTableRow>
                          <MuiTableCell className="p-0!" colSpan={totalColumns}>
                            {rowFooter}
                          </MuiTableCell>
                        </MuiTableRow>
                      )}
                    </Fragment>
                  );
                })}
              </MuiTableBody>
            </MuiTable>
          </MuiTableContainer>

          <TableCards
            controls={controls}
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
            onOrderChange={updateOrder}
            renderRowControl={renderRowControl}
            renderRowFooter={renderRowFooter}
            hideCardDelimiter={hideCardDelimiter}
          />
        </>
      ) : (
        placeholder
      )}
    </Card>
  );
}
