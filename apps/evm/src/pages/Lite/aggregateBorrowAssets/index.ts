import BigNumber from 'bignumber.js';
import type { Asset, SpokePool, Token } from 'types';
import getCombinedApy from 'utilities/getCombinedApy';
import { isAssetPaused } from 'utilities/isAssetPaused';
import type { LiteBorrowAsset, LiteBorrowMarket, LiteBorrowSource } from '../types';

const getBorrowApyPercentage = (asset: Asset) =>
  getCombinedApy({
    type: 'borrow',
    baseApyPercentage: asset.borrowApyPercentage,
    tokenDistributions: asset.borrowTokenDistributions,
  }).totalApyPercentage;

const TOTAL_FIELDS = ['borrowTokens', 'borrowCents', 'liquidityTokens', 'liquidityCents'] as const;

const isBorrowableAsset = (asset: Asset) =>
  asset.isBorrowable &&
  !asset.disabledTokenActions.includes('borrow') &&
  !isAssetPaused({ disabledTokenActions: asset.disabledTokenActions });

const toBorrowMarket = ({
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

export const aggregateBorrowAssets = ({
  assets,
  spokePools,
}: {
  assets: Asset[];
  spokePools: SpokePool[];
}) => {
  const assetsByToken = new Map<string, LiteBorrowAsset>();

  const addMarket = ({ token, market }: { token: Token; market: LiteBorrowMarket }) => {
    const key = `${token.chainId}:${token.address.toLowerCase()}`;
    const borrowAsset = assetsByToken.get(key) ?? {
      key,
      token,
      markets: [],
      borrowTokens: new BigNumber(0),
      borrowCents: new BigNumber(0),
      liquidityTokens: new BigNumber(0),
      liquidityCents: new BigNumber(0),
    };

    borrowAsset.markets.push(market);
    TOTAL_FIELDS.forEach(field => {
      borrowAsset[field] = borrowAsset[field].plus(market[field]);
    });

    assetsByToken.set(key, borrowAsset);
  };

  const coreCollateralTokens = assets
    .filter(asset => asset.collateralFactor > 0)
    .map(asset => asset.vToken.underlyingToken);

  assets.filter(isBorrowableAsset).forEach(asset =>
    addMarket({
      token: asset.vToken.underlyingToken,
      market: toBorrowMarket({
        asset,
        id: asset.vToken.address,
        source: { type: 'core', asset },
        collateralTokens: coreCollateralTokens,
      }),
    }),
  );

  spokePools.forEach(spokePool => {
    const collateralTokens = spokePool.assets
      .filter(spokeAsset => !spokeAsset.isBorrowable)
      .map(spokeAsset => spokeAsset.vToken.underlyingToken);

    spokePool.assets.filter(isBorrowableAsset).forEach(spokeAsset =>
      addMarket({
        token: spokeAsset.vToken.underlyingToken,
        market: toBorrowMarket({
          collateralTokens,
          asset: spokeAsset,
          id: `${spokePool.comptrollerAddress}:${spokeAsset.vToken.address}`,
          source: { type: 'spoke', pool: spokePool, asset: spokeAsset },
        }),
      }),
    );
  });

  return [...assetsByToken.values()].sort(
    (a, b) => b.borrowCents.comparedTo(a.borrowCents) || a.key.localeCompare(b.key),
  );
};
