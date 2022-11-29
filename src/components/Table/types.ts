import React from 'react';

import { BREAKPOINTS } from 'theme/MuiThemeProvider/muiTheme';

export type TableRow = Record<string, unknown>;

export interface TableColumn<R extends TableRow> {
  key: string;
  label: string;
  renderCell: (row: R) => React.ReactNode | string;
  sortRows?: (rowA: R, rowB: R, direction: 'asc' | 'desc') => -1 | 0 | 1;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<R extends TableRow> {
  data: R[];
  rowKeyExtractor: (row: R) => string;
  breakpoint: keyof typeof BREAKPOINTS['values'];
  columns: TableColumn<R>[];
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
}
