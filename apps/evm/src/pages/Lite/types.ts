import type BigNumber from 'bignumber.js';
import type { Asset, LiquidityHub, SpokeAsset, SpokePool, Token, VenusVault } from 'types';

export type LiteEarnMarketSource =
  | { type: 'core'; asset: Asset }
  | { type: 'hub'; hub: LiquidityHub }
  | { type: 'vault'; vault: VenusVault };

export interface LiteEarnMarket {
  id: string;
  source: LiteEarnMarketSource;
  apyPercentage: BigNumber;
  supplyTokens: BigNumber;
  supplyCents: BigNumber;
  liquidityTokens: BigNumber;
  liquidityCents: BigNumber;
}

export interface LiteEarnAsset {
  key: string;
  token: Token;
  markets: LiteEarnMarket[];
  supplyTokens: BigNumber;
  supplyCents: BigNumber;
  liquidityTokens: BigNumber;
  liquidityCents: BigNumber;
}

export type LiteBorrowSource =
  | { type: 'core'; asset: Asset }
  | { type: 'spoke'; pool: SpokePool; asset: SpokeAsset };

export interface LiteBorrowMarket {
  id: string;
  source: LiteBorrowSource;
  apyPercentage: BigNumber;
  borrowTokens: BigNumber;
  borrowCents: BigNumber;
  liquidityTokens: BigNumber;
  liquidityCents: BigNumber;
  collateralTokens: Token[];
}

export interface LiteBorrowAsset {
  key: string;
  token: Token;
  markets: LiteBorrowMarket[];
  borrowTokens: BigNumber;
  borrowCents: BigNumber;
  liquidityTokens: BigNumber;
  liquidityCents: BigNumber;
}
