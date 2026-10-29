import BigNumber from 'bignumber.js';
import type { Asset, LiquidityHub, Token, VenusVault } from 'types';
import { convertMantissaToTokens } from 'utilities';
import { getSupplyApyPercentage } from '../getSupplyApyPercentage';
import { getTokenKey } from '../getTokenKey';
import type { LiteEarnAsset, LiteEarnMarket } from '../types';
import { getCoreOverlap } from './getCoreOverlap';

const TOTAL_FIELDS = ['supplyTokens', 'supplyCents', 'liquidityTokens', 'liquidityCents'] as const;

export const aggregateEarnAssets = ({
  assets,
  liquidityHubs,
  vaults,
}: {
  assets: Asset[];
  liquidityHubs: LiquidityHub[];
  vaults: VenusVault[];
}) => {
  const assetsByToken = new Map<string, LiteEarnAsset>();

  const addMarket = ({
    token,
    market,
    overlap,
  }: {
    token: Token;
    market: LiteEarnMarket;
    overlap?: Pick<LiteEarnMarket, (typeof TOTAL_FIELDS)[number]>;
  }) => {
    const key = getTokenKey(token);
    const earnAsset = assetsByToken.get(key) ?? {
      key,
      token,
      markets: [],
      supplyTokens: new BigNumber(0),
      supplyCents: new BigNumber(0),
      liquidityTokens: new BigNumber(0),
      liquidityCents: new BigNumber(0),
    };

    earnAsset.markets.push(market);

    TOTAL_FIELDS.forEach(field => {
      earnAsset[field] = earnAsset[field].plus(
        BigNumber.maximum(0, market[field].minus(overlap?.[field] ?? 0)),
      );
    });

    assetsByToken.set(key, earnAsset);
  };

  assets.forEach(asset =>
    addMarket({
      token: asset.vToken.underlyingToken,
      market: {
        id: asset.vToken.address,
        source: { type: 'core', asset },
        apyPercentage: getSupplyApyPercentage(asset),
        supplyTokens: asset.supplyBalanceTokens,
        supplyCents: asset.supplyBalanceCents,
        liquidityTokens: asset.cashTokens,
        liquidityCents: asset.liquidityCents,
      },
    }),
  );

  liquidityHubs.forEach(liquidityHub => {
    const token = liquidityHub.vhToken.underlyingToken;
    const coreAssets = assets.filter(
      asset =>
        asset.vToken.underlyingToken.chainId === token.chainId &&
        asset.vToken.underlyingToken.address.toLowerCase() === token.address.toLowerCase(),
    );

    addMarket({
      token,
      market: {
        id: liquidityHub.vhToken.address,
        source: { type: 'hub', hub: liquidityHub },
        apyPercentage: getSupplyApyPercentage(liquidityHub),
        supplyTokens: liquidityHub.supplyBalanceTokens,
        supplyCents: liquidityHub.supplyBalanceCents,
        liquidityTokens: liquidityHub.liquidityTokens,
        liquidityCents: liquidityHub.liquidityCents,
      },
      overlap: getCoreOverlap({ liquidityHub, coreAssets }),
    });
  });

  vaults.forEach(vault =>
    addMarket({
      token: vault.stakedToken,
      market: {
        id: `vault-${vault.key}`,
        source: { type: 'vault', vault },
        apyPercentage: getSupplyApyPercentage(vault),
        supplyTokens: convertMantissaToTokens({
          value: vault.stakeBalanceMantissa,
          token: vault.stakedToken,
        }),
        supplyCents: new BigNumber(vault.stakeBalanceCents),
        liquidityTokens: new BigNumber(0),
        liquidityCents: new BigNumber(0),
      },
    }),
  );

  return [...assetsByToken.values()].sort((a, b) => {
    const highestA = BigNumber.maximum(...a.markets.map(market => market.apyPercentage));
    const highestB = BigNumber.maximum(...b.markets.map(market => market.apyPercentage));

    return (
      highestB.comparedTo(highestA) ||
      b.supplyCents.comparedTo(a.supplyCents) ||
      a.key.localeCompare(b.key)
    );
  });
};
