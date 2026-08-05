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
import { getTableCellHeight } from './getTableCellHeight';
import { isInteractiveElement } from './isInteractiveElement';
import type { Order, TableColumn, TableProps } from './types';

export * from './types';

export function Table<R>({
  controls = true,
  columns,
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
  tableContainerClassName,
  tableHeaderClassName,
  tableHeadCellClassName,
  ...otherProps
}: TableProps<R>) {
  const { formatTo } = useFormatTo();
  const navigate = useNavigate();
  const totalColumns = columns.length + (renderRowControl ? 1 : 0);
  const tablecellheight = getTableCellHeight(cellHeight);
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
      className={cn(
        'p-0',
        breakpoint && 'border-0 bg-transparent',
        breakpoint === 'xs' && 'xs:border xs:border-dark-blue-hover',
        breakpoint === 'sm' && 'sm:border sm:border-dark-blue-hover',
        breakpoint === 'md' && 'md:border md:border-dark-blue-hover',
        breakpoint === 'lg' && 'lg:border lg:border-dark-blue-hover',
        breakpoint === 'xl' && 'xl:border xl:border-dark-blue-hover',
        breakpoint === '2xl' && '2xl:border 2xl:border-dark-blue-hover',
        className,
      )}
      {...otherProps}
    >
      {title && (
        <div
          className={cn(
            'pt-4 mb-2 h-8 text-p2s',
            breakpoint ? 'px-0' : 'px-4',
            breakpoint === 'xs' && 'xs:px-4',
            breakpoint === 'sm' && 'sm:px-4',
            breakpoint === 'md' && 'md:px-4',
            breakpoint === 'lg' && 'lg:px-4',
            breakpoint === 'xl' && 'xl:px-4',
            breakpoint === '2xl' && '2xl:px-4',
          )}
        >
          {title}
        </div>
      )}

      {!!header && (
        <div
          className={cn(
            'mb-4',
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
              <Head
                className={cn(
                  variant === 'primary' && 'border-b border-dark-blue-hover',
                  tableHeaderClassName,
                )}
                headCellClassName={tableHeadCellClassName}
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
                          'h-18 text-white hover:bg-background-hover hover:no-underline',
                          isRowClickable && 'cursor-pointer',
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
                                variant === 'secondary' && column === columns[0] && 'rounded-l-lg',
                                variant === 'secondary' &&
                                  !renderRowControl &&
                                  column === columns[columns.length - 1] &&
                                  'rounded-r-lg',
                              )}
                              style={{ height: tablecellheight }}
                              key={`${rowKey}-${column.key}`}
                              title={cellTitle}
                              align={column.align}
                            >
                              {cellContent}
                            </TableCell>
                          );
                        })}

                        {renderRowControl && (
                          <TableCell
                            className={cn(
                              'align-middle',
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
