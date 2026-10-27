import BigNumber from 'bignumber.js';
import type { Asset, LiquidityHub } from 'types';

/** Hub deposits routed into core markets are reported twice, so they are counted once. */
export const getCoreOverlap = ({
  liquidityHub,
  coreAssets,
}: {
  liquidityHub: LiquidityHub;
  coreAssets: Asset[];
}) =>
  liquidityHub.yieldGroups
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
