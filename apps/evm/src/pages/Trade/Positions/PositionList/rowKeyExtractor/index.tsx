import type { TradePosition } from 'types';

export const rowKeyExtractor = (row: TradePosition) =>
  `${row.pool.comptrollerAddress}-${row.longAsset.vToken.address}-${row.shortAsset.vToken.address}`;
