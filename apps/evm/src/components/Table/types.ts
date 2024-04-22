import type { BREAKPOINTS } from 'theme/MuiThemeProvider/muiTheme';

export interface TableColumn<R> {
  key: string;
  label: React.ReactNode | string;
  selectOptionLabel: string;
  renderCell: (row: R, rowIndex: number) => React.ReactNode | string;
  sortRows?: (rowA: R, rowB: R, direction: 'asc' | 'desc') => number;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<R> {
  data: R[];
  rowKeyExtractor: (row: R) => string;
  columns: TableColumn<R>[];
  breakpoint?: keyof (typeof BREAKPOINTS)['values'];
  cardColumns?: TableColumn<R>[];
  minWidth?: string;
  initialOrder?: {
    orderBy: TableColumn<R>;
    orderDirection: 'asc' | 'desc';
  };
  className?: string;
  isFetching?: boolean;
  rowOnClick?: (e: React.MouseEvent<HTMLDivElement>, row: R) => void;
  getRowHref?: (row: R) => string;
  title?: string;
  testId?: string;
}

export interface Order<R> {
  orderBy: TableColumn<R>;
  orderDirection: 'asc' | 'desc';
}
