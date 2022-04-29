import React, { useMemo, useState } from 'react';

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
  gridTemplateColumns?: string;
  gridTemplateRowsMobile?: string /* used for mobile view if table has to display more than 1 row */;
  isMobileView?: boolean;
}

/* helper function for getting grid-template-columns string, used by default for similar cells width depending on cells count */
const getTemplateColumnsString = (columnsArray: Array<unknown>) =>
  columnsArray.map(() => '1fr').join(' ');

export const useTable = ({
  columns,
  initialOrder,
  data,
  gridTemplateColumns,
  isMobileView,
}: Pick<
  ITableProps,
  'columns' | 'initialOrder' | 'data' | 'gridTemplateColumns' | 'isMobileView'
>) => {
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
  const gridColumns =
    gridTemplateColumns ||
    useMemo(
      () =>
        /* if gridTemplateColumns prop is not passed from parent component, we create similar fractions by default */
        isMobileView
          ? /* getting default gridTemplateColumns string depending on columns array length */
            getTemplateColumnsString(columns.slice(1, columns.length))
          : getTemplateColumnsString(columns),
      [columns],
    );

  return {
    rows,
    orderBy,
    orderDirection,
    onRequestOrder,
    gridColumns,
  };
};
