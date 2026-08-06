import type { TableProps } from '../types';

export function getTableCellHeight<R>(cellHeight: TableProps<R>['cellHeight']) {
  if (typeof cellHeight === 'number') {
    return `${cellHeight}px`;
  }

  return cellHeight ?? '1px';
}
