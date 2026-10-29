import type { Asset, Token } from 'types';
import { getBorrowApyPercentage } from '../../getBorrowApyPercentage';
import type { LiteBorrowMarket, LiteBorrowSource } from '../../types';

export const toBorrowMarket = ({
  id,
  source,
  asset,
  collateralTokens,
}: {
  id: string;
  source: LiteBorrowSource;
  asset: Asset;
  collateralTokens: Token[];
}): LiteBorrowMarket => ({
  id,
  source,
  collateralTokens,
  apyPercentage: getBorrowApyPercentage(asset),
  borrowTokens: asset.borrowBalanceTokens,
  borrowCents: asset.borrowBalanceCents,
  liquidityTokens: asset.cashTokens,
  liquidityCents: asset.liquidityCents,
});
