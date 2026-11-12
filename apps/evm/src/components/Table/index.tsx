import { Spinner, cn } from '@venusprotocol/ui';
import { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { useFormatTo } from 'hooks/useFormatTo';

import { Card } from 'components/Card';
import Head from './Head';
import { TableBody } from './TableBody';
import { TableCards } from './TableCards';
import { TableCell } from './TableCell';
import { TableContainer } from './TableContainer';
import { TableElement } from './TableElement';
import { TableRow } from './TableRow';
import { isInteractiveElement } from './isInteractiveElement';
import type { Order, TableColumn, TableProps } from './types';

export * from './types';

export function Table<R>({
  controls = true,
  columns,
  columnWidths,
  cardClassName,
  cardColumns,
  data,
  title,
  minWidth: unsafeMinWidth,
  initialOrder,
  order: orderProp,
  onOrderChange,
  rowOnClick,
  getRowHref,
  rowKeyExtractor,
  breakpoint,
  isFetching,
  size = 'md',
  stickyHeader = false,
  header,
  placeholder,
  selectVariant,
  variant = 'primary',
  tableLayout = 'fixed',
  renderRowFooter,
  renderRowControl,
  hideCardDelimiter,
  className,
  tableRowClassName,
  getRowClassName,
  tableHeaderClassName,
  tableContainerClassName,
  ...otherProps
}: TableProps<R>) {
  const { formatTo } = useFormatTo();
  const navigate = useNavigate();
  const totalColumns = columns.length + (renderRowControl ? 1 : 0);
  const minwidth = unsafeMinWidth ?? '0';
  const tablelayout = tableLayout;

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
    const sortRows = order?.orderBy.sortRows;

    if (!order || !sortRows) {
      return data;
    }

    return [...data].sort((rowA, rowB) => sortRows(rowA, rowB, order.orderDirection));
  }, [data, order]);

  return (
    <Card
      variant={variant === 'primary' ? 'glass' : 'primary'}
      className={cn(
        'p-0',
        breakpoint && 'border-0 bg-transparent shadow-none before:hidden',
        breakpoint === 'xs' && [
          'xs:border',
          variant === 'primary' && 'xs:bg-surface-glass xs:shadow-glass xs:before:block',
        ],
        breakpoint === 'sm' && [
          'sm:border',
          variant === 'primary' && 'sm:bg-surface-glass sm:shadow-glass sm:before:block',
        ],
        breakpoint === 'md' && [
          'md:border',
          variant === 'primary' && 'md:bg-surface-glass md:shadow-glass md:before:block',
        ],
        breakpoint === 'lg' && [
          'lg:border',
          variant === 'primary' && 'lg:bg-surface-glass lg:shadow-glass lg:before:block',
        ],
        breakpoint === 'xl' && [
          'xl:border',
          variant === 'primary' && 'xl:bg-surface-glass xl:shadow-glass xl:before:block',
        ],
        breakpoint === '2xl' && [
          '2xl:border',
          variant === 'primary' && '2xl:bg-surface-glass 2xl:shadow-glass 2xl:before:block',
        ],
        className,
      )}
      {...otherProps}
    >
      {title && (
        <div
          className={cn(
            'mb-2 h-8 text-p2s',
            breakpoint ? 'px-0' : 'px-4',
            breakpoint === 'xs' && 'xs:px-4',
            breakpoint === 'sm' && 'sm:px-4',
            breakpoint === 'md' && 'md:px-4',
            breakpoint === 'lg' && 'lg:px-4',
            breakpoint === 'xl' && 'xl:px-4',
            breakpoint === '2xl' && '2xl:px-4',
            size === 'compact' && 'md:px-6',
          )}
        >
          {title}
        </div>
      )}

      {!!header && (
        <div
          className={cn(
            'mb-4',
            size === 'compact' && !breakpoint && 'mb-0 p-3',
            breakpoint === 'xs' && 'xs:mb-0 xs:p-4',
            breakpoint === 'sm' && 'sm:mb-0 sm:p-4',
            breakpoint === 'md' && 'md:mb-0 md:p-4',
            breakpoint === 'lg' && 'lg:mb-0 lg:p-4',
            breakpoint === 'xl' && 'xl:mb-0 xl:p-4',
            breakpoint === '2xl' && '2xl:mb-0 2xl:p-4',
          )}
        >
          {header}
        </div>
      )}

      {data.length > 0 || !placeholder ? (
        <>
          <TableContainer
            className={cn(
              breakpoint && 'hidden',
              breakpoint === 'xs' && 'xs:block',
              breakpoint === 'sm' && 'sm:block',
              breakpoint === 'md' && 'md:block',
              breakpoint === 'lg' && 'lg:block',
              breakpoint === 'xl' && 'xl:block',
              breakpoint === '2xl' && '2xl:block',
              tableContainerClassName,
            )}
          >
            <TableElement style={{ minWidth: minwidth, tableLayout: tablelayout }}>
              {columnWidths && (
                <colgroup>
                  {columnWidths.map((columnwidth, columnIndex) => (
                    <col key={`${columnIndex}-${columnwidth}`} style={{ width: columnwidth }} />
                  ))}
                </colgroup>
              )}

              <Head
                className={cn(
                  variant === 'primary' && 'border-b border-subtle',
                  tableHeaderClassName,
                )}
                controls={controls}
                columns={columns}
                isCompact={size === 'compact'}
                isSticky={stickyHeader}
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

              <TableBody>
                {sortedData.map((row, rowIndex) => {
                  const rowKey = rowKeyExtractor(row);
                  const rowFooter = renderRowFooter?.(row, rowIndex);
                  const rowHref = getRowHref?.(row);
                  const formattedRowHref = rowHref ? formatTo({ to: rowHref }) : undefined;
                  const isRowLink = !!formattedRowHref;
                  const isRowClickable = isRowLink || !!rowOnClick;

                  return (
                    <Fragment key={rowKey}>
                      <TableRow
                        className={cn(
                          'group text-primary hover:no-underline',
                          size === 'compact' ? 'h-15' : 'h-18 hover:bg-table-row-hover',
                          isRowClickable && 'cursor-pointer',
                          tableRowClassName,
                          getRowClassName?.(row),
                        )}
                        onClick={
                          isRowClickable
                            ? e => {
                                if (isInteractiveElement(e.target)) {
                                  return;
                                }

                                rowOnClick?.(e as unknown as React.MouseEvent<HTMLDivElement>, row);

                                if (!formattedRowHref || e.defaultPrevented) {
                                  return;
                                }

                                void navigate(formattedRowHref);
                              }
                            : undefined
                        }
                        role={isRowLink ? 'link' : undefined}
                        tabIndex={isRowLink ? 0 : undefined}
                      >
                        {columns.map(column => {
                          const cellContent = column.renderCell(row, rowIndex);
                          const cellTitle =
                            typeof cellContent === 'string' ? cellContent : undefined;

                          return (
                            <TableCell
                              className={cn(
                                'overflow-hidden text-ellipsis',
                                size === 'compact' &&
                                  'bg-size-[100%_calc(100%-8px)] bg-center bg-no-repeat px-3 py-2 group-hover:bg-row-hover max-md:text-base md:px-6 md:py-0',
                                variant === 'secondary' && column === columns[0] && 'rounded-l-lg',
                                variant === 'secondary' &&
                                  !renderRowControl &&
                                  column === columns[columns.length - 1] &&
                                  'rounded-r-lg',
                              )}
                              key={`${rowKey}-${column.key}`}
                              title={cellTitle}
                              align={column.align}
                              colSpan={column.colSpan}
                            >
                              {cellContent}
                            </TableCell>
                          );
                        })}

                        {renderRowControl && (
                          <TableCell
                            className={cn(
                              'align-middle',
                              size === 'compact' &&
                                'bg-size-[100%_calc(100%-8px)] bg-center bg-no-repeat group-hover:bg-row-hover',
                              variant === 'secondary' && 'rounded-r-lg',
                            )}
                          >
                            {renderRowControl(row, rowIndex)}
                          </TableCell>
                        )}
                      </TableRow>

                      {rowFooter !== undefined && rowFooter !== null && (
                        <TableRow>
                          <TableCell className="p-0" colSpan={totalColumns}>
                            {rowFooter}
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </TableElement>
          </TableContainer>

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
