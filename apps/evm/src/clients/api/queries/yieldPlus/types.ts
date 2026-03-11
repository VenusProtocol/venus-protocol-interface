import type { Token } from 'types';

export interface YieldPlusPair {
  longToken: Token;
  shortToken: Token;
  longLiquidity: string;
  shortLiquidity: string;
  supplyApy: number;
  borrowApy: number;
  price: string;
  priceChange24h: number;
}

export interface OhlcvCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface YieldPlusPosition {
  id: string;
  side: 'long' | 'short';
  longToken: Token;
  shortToken: Token;
  collateralToken: Token;
  collateralAmount: string;
  leverage: number;
  entryPrice: string;
  liquidationPrice: string;
  pnl: string;
  pnlPercentage: number;
  healthFactor: number;
  ltv: number;
  netApy: number;
}

export interface YieldPlusTransaction {
  id: string;
  type: 'open' | 'close' | 'liquidation';
  side: 'long' | 'short';
  longToken: Token;
  shortToken: Token;
  collateralAmount: string;
  leverage: number;
  price: string;
  timestamp: number;
  txHash: string;
}
