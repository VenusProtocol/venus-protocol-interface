import type { BREAKPOINTS } from 'App/MuiThemeProvider/muiTheme';
import type { CSSProperties } from 'react';
import type { To } from 'react-router';

import type { CardProps } from 'components/Card';
import type { SelectProps } from 'components/Select';

export interface TableColumn<R> {
  key: string;
  label: React.ReactNode | string;
  selectOptionLabel: string;
  renderCell: (row: R, rowIndex: number) => React.ReactNode | string;
  sortRows?: (rowA: R, rowB: R, direction: 'asc' | 'desc') => number;
  // Marks the column as sortable without client-side sorting, for server-sorted tables that report
  // order changes through the table's onOrderChange callback
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<R> extends Omit<CardProps, 'title'> {
  data: R[];
  rowKeyExtractor: (row: R) => string;
  columns: TableColumn<R>[];
  tableLayout?: CSSProperties['tableLayout'];
  breakpoint?: keyof (typeof BREAKPOINTS)['values'];
  cardColumns?: TableColumn<R>[];
  minWidth?: string;
  // Initial sort for uncontrolled usage (client-side sorted tables)
  initialOrder?: {
    orderBy: TableColumn<R>;
    orderDirection: 'asc' | 'desc';
  };
  // Controlled sort: when provided, the table reflects this order instead of its internal state
  // (used together with onOrderChange for server-side sorting)
  order?: Order<R>;
  // Notified when the user changes the sort via a column header
  onOrderChange?: (order: Order<R>) => void;
  cardClassName?: string;
  hideCardDelimiter?: boolean;
  className?: string;
  isFetching?: boolean;
  rowOnClick?: (e: React.MouseEvent<HTMLDivElement>, row: R) => void;
  renderRowFooter?: (row: R, rowIndex: number) => React.ReactNode | string;
  renderRowControl?: (row: R, rowIndex: number) => React.ReactNode | string;
  getRowHref?: (row: R) => To;
  variant?: 'primary' | 'secondary';
  title?: React.ReactNode | string;
  header?: React.ReactNode;
  placeholder?: React.ReactNode;
  selectVariant?: SelectProps['variant'];
  cellHeight?: CSSProperties['height'];
  size?: 'sm' | 'md';
  controls?: boolean;
}

export interface TableCardProps<R>
  extends Pick<
    TableProps<R>,
    | 'cardClassName'
    | 'hideCardDelimiter'
    | 'data'
    | 'rowKeyExtractor'
    | 'rowOnClick'
    | 'getRowHref'
    | 'breakpoint'
    | 'columns'
    | 'isFetching'
    | 'selectVariant'
    | 'controls'
    | 'renderRowFooter'
    | 'renderRowControl'
  > {
  order: Order<R> | undefined;
  onOrderChange: (newOrder: Order<R>) => void;
}

export interface Order<R> {
  orderBy: TableColumn<R>;
  orderDirection: 'asc' | 'desc';
}
