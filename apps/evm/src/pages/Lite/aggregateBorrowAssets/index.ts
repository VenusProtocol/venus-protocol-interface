import BigNumber from 'bignumber.js';
import type { Asset, SpokePool, Token } from 'types';
import { getTokenKey } from '../getTokenKey';
import type { LiteBorrowAsset, LiteBorrowMarket } from '../types';
import { isBorrowableAsset } from './isBorrowableAsset';
import { toBorrowMarket } from './toBorrowMarket';

const TOTAL_FIELDS = ['borrowTokens', 'borrowCents', 'liquidityTokens', 'liquidityCents'] as const;

export const aggregateBorrowAssets = ({
  assets,
  spokePools,
}: {
  assets: Asset[];
  spokePools: SpokePool[];
}) => {
  const assetsByToken = new Map<string, LiteBorrowAsset>();

  const addMarket = ({ token, market }: { token: Token; market: LiteBorrowMarket }) => {
    const key = getTokenKey(token);
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
