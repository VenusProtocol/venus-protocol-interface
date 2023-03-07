import React from 'react';

export interface TableRowProps {
  key: string | number;
  render: () => React.ReactNode | string;
  value: string | number | boolean;
}

export interface TableColumn<R> {
  key: string;
  label: string;
  orderable: boolean;
  sortRows?: (rowA: R, rowB: R, direction: 'asc' | 'desc') => number;
  align?: 'left' | 'center' | 'right';
}

export interface Order {
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}
