export const MARKET_TX_TYPES = [
  'supply',
  'borrow',
  'withdraw',
  'repay',
  'enterMarket',
  'exitMarket',
] as const;

export const YIELD_PLUS_TX_TYPES = [
  'positionClosedWithLoss',
  'positionClosedWithProfit',
  'positionOpened',
  'positionReducedWithProfit',
  'positionReducedWithLoss',
  'positionIncreased',
  'profitConverted',
  'principalSupplied',
  'principalWithdrawn',
] as const;

export const TX_TYPES = [...MARKET_TX_TYPES, ...YIELD_PLUS_TX_TYPES];
