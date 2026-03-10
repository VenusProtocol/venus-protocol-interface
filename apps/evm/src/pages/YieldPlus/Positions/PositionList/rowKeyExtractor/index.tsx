import type { Row } from '../types';

export const rowKeyExtractor = (row: Row) =>
  `${row.pool.comptrollerAddress}-${row.longToken.address}-${row.shortToken.address}`;
