import type { YieldPlusPosition } from 'types';

export const rowKeyExtractor = (row: YieldPlusPosition) =>
  `${row.pool.comptrollerAddress}-${row.longAsset.vToken.address}-${row.shortAsset.vToken.address}`;
