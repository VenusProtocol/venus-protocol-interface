import type { BREAKPOINTS } from 'App/MuiThemeProvider/muiTheme';
import type { CardProps } from 'components/Card';
import type { SelectProps } from 'components/Select';

export interface TableColumn<R> {
  key: string;
  label: React.ReactNode | string;
  selectOptionLabel: string;
  renderCell: (row: R, rowIndex: number) => React.ReactNode | string;
  sortRows?: (rowA: R, rowB: R, direction: 'asc' | 'desc') => number;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<R> extends CardProps {
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
  cardClassName?: string;
  className?: string;
  isFetching?: boolean;
  rowOnClick?: (e: React.MouseEvent<HTMLDivElement>, row: R) => void;
  getRowHref?: (row: R) => string;
  title?: string;
  header?: React.ReactNode;
  placeholder?: React.ReactNode;
  selectVariant?: SelectProps['variant'];
}

export interface TableCardProps<R>
  extends Pick<
    TableProps<R>,
    | 'cardClassName'
    | 'data'
    | 'rowKeyExtractor'
    | 'rowOnClick'
    | 'getRowHref'
    | 'breakpoint'
    | 'columns'
    | 'isFetching'
    | 'selectVariant'
  > {
  order: Order<R> | undefined;
  onOrderChange: (newOrder: Order<R>) => void;
}

export interface Order<R> {
  orderBy: TableColumn<R>;
  orderDirection: 'asc' | 'desc';
}
