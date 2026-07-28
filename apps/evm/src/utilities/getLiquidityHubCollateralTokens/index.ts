import type { LiquidityHubYieldGroup } from 'types';

export const getLiquidityHubCollateralTokens = ({
  yieldGroups,
}: {
  yieldGroups: LiquidityHubYieldGroup[];
}) =>
  yieldGroups.flatMap(yieldGroup => yieldGroup.sources.flatMap(source => source.collateralTokens));
