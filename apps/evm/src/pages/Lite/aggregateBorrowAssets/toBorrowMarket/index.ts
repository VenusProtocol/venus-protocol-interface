import type { Asset } from 'types';
import { getBorrowApyPercentage } from '../../getBorrowApyPercentage';
import type { LiteBorrowMarket, LiteBorrowSource } from '../../types';

export const toBorrowMarket = ({
  id,
  source,
  asset,
}: {
  id: string;
  source: LiteBorrowSource;
  asset: Asset;
}): LiteBorrowMarket => ({
  id,
  source,
  apyPercentage: getBorrowApyPercentage(asset),
  borrowTokens: asset.borrowBalanceTokens,
  borrowCents: asset.borrowBalanceCents,
  liquidityTokens: asset.cashTokens,
  liquidityCents: asset.liquidityCents,
});
