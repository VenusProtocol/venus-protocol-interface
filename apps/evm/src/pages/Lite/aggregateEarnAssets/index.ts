import BigNumber from 'bignumber.js';
import type { Asset, LiquidityHub, Token } from 'types';
import getCombinedApy from 'utilities/getCombinedApy';
import type { LiteEarnAsset, LiteEarnMarket } from '../types';

const getSupplyApyPercentage = (source: Asset | LiquidityHub) =>
  getCombinedApy({
    type: 'supply',
    baseApyPercentage: source.supplyApyPercentage,
    tokenDistributions: source.supplyTokenDistributions,
  }).totalApyPercentage;

const TOTAL_FIELDS = ['supplyTokens', 'supplyCents', 'liquidityTokens', 'liquidityCents'] as const;

const getTokenKey = (token: Token) => `${token.chainId}:${token.address.toLowerCase()}`;

const getHighestApyPercentage = (asset: LiteEarnAsset) =>
  BigNumber.maximum(...asset.markets.map(market => market.apyPercentage));

// Hub deposits routed into core markets are counted once.
const getCoreOverlap = (hub: LiquidityHub, coreAssets: Asset[]) =>
  hub.yieldGroups
    .flatMap(yieldGroup => yieldGroup.sources)
    .filter(source =>
      coreAssets.some(asset => asset.vToken.address.toLowerCase() === source.address.toLowerCase()),
    )
    .reduce(
      (acc, source) => ({
        supplyTokens: acc.supplyTokens.plus(source.allocationTokens),
        supplyCents: acc.supplyCents.plus(source.allocationCents),
        liquidityTokens: acc.liquidityTokens.plus(source.liquidityTokens),
        liquidityCents: acc.liquidityCents.plus(source.liquidityCents),
      }),
      {
        supplyTokens: new BigNumber(0),
        supplyCents: new BigNumber(0),
        liquidityTokens: new BigNumber(0),
        liquidityCents: new BigNumber(0),
      },
    );

export const aggregateEarnAssets = ({
  assets,
  liquidityHubs,
}: {
  assets: Asset[];
  liquidityHubs: LiquidityHub[];
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

  liquidityHubs.forEach(hub => {
    const token = hub.vhToken.underlyingToken;
    const coreAssets = assets.filter(
      asset =>
        asset.vToken.underlyingToken.chainId === token.chainId &&
        asset.vToken.underlyingToken.address.toLowerCase() === token.address.toLowerCase(),
    );

    addMarket({
      token,
      market: {
        id: hub.vhToken.address,
        source: { type: 'hub', hub },
        apyPercentage: getSupplyApyPercentage(hub),
        supplyTokens: hub.supplyBalanceTokens,
        supplyCents: hub.supplyBalanceCents,
        liquidityTokens: hub.liquidityTokens,
        liquidityCents: hub.liquidityCents,
      },
      overlap: getCoreOverlap(hub, coreAssets),
    });
  });

  return [...assetsByToken.values()].sort(
    (a, b) =>
      getHighestApyPercentage(b).comparedTo(getHighestApyPercentage(a)) ||
      b.supplyCents.comparedTo(a.supplyCents) ||
      a.key.localeCompare(b.key),
  );
};
