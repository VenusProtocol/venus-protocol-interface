import { xvsCoreSource, xvsFluxSource } from '__mocks__/models/liquidityHubSources';
import { xvsCoreYieldGroup, xvsFluxYieldGroup } from '__mocks__/models/liquidityHubYieldGroups';
import { getLiquidityHubCollateralTokens } from '..';

describe('getLiquidityHubCollateralTokens', () => {
  it('returns collateral tokens from every source in every yield group', () => {
    const collateralTokens = getLiquidityHubCollateralTokens({
      yieldGroups: [
        {
          ...xvsCoreYieldGroup,
          sources: [xvsCoreSource, xvsFluxSource],
        },
        xvsFluxYieldGroup,
      ],
    });

    expect(collateralTokens).toEqual([
      ...xvsCoreSource.collateralTokens,
      ...xvsFluxSource.collateralTokens,
      ...xvsFluxSource.collateralTokens,
    ]);
  });
});
