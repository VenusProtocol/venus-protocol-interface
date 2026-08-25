import type { ApiLiquidityHub, ApiLiquidityHubYieldGroup } from 'types';

// TODO: REMOVE ME (VPD-1880). Temporary local mock: the API does not expose Centrifuge funds or
// their agency ratings yet (VPD-1881), so this appends one `centrifuge` yield group to the USDT hub
// so the group row, the fund sub-table and the CRA column can be exercised in the app. Values are
// the real ones published in the Centrifuge pool metadata.
const MOCKED_HUB_SYMBOL = 'vhUSDT';

const toMantissa = (amount: number) => `${BigInt(amount) * 10n ** 18n}`;

export const mockCentrifugeYieldGroup = (apiLiquidityHub: ApiLiquidityHub): ApiLiquidityHub => {
  const [templateYieldGroup] = apiLiquidityHub.yieldGroups;

  if (apiLiquidityHub.symbol !== MOCKED_HUB_SYMBOL || !templateYieldGroup) {
    return apiLiquidityHub;
  }

  const [templateResource] = templateYieldGroup.resources;

  const centrifugeYieldGroup: ApiLiquidityHubYieldGroup = {
    ...templateYieldGroup,
    yieldGroupAddress: '0x1111111111111111111111111111111111111111',
    kind: 'centrifuge',
    totalUnderlyingMantissa: toMantissa(24310000),
    totalUnderlyingUsdMantissa: toMantissa(24310000),
    spotApyRatio: '0.061',
    percentageCapRatio: '0.15',
    absoluteCapMantissa: toMantissa(10000000),
    absoluteCapUsdMantissa: toMantissa(10000000),
    effectiveCapMantissa: toMantissa(10000000),
    maxWithdrawMantissa: toMantissa(24310000),
    resources: [
      {
        ...templateResource,
        resourceAddress: '0x2222222222222222222222222222222222222222',
        kind: 'centrifuge',
        name: 'Janus Henderson Treasury Fund',
        allocationMantissa: toMantissa(14590000),
        allocationUsdMantissa: toMantissa(14590000),
        apyRatio: '0.0358',
        liquidityMantissa: toMantissa(14590000),
        capMantissa: null,
        capUsdMantissa: null,
        lockEndTime: null,
        rewardsDistributors: [],
        exposure: [],
        ratings: [
          {
            agency: "Moody's",
            value: 'Aa-bf',
            reportUrl:
              'https://www.moodys.com/research/Moodys-Ratings-assigns-a-Aa-bf-Bond-Fund-rating-to-Anemoy-Assessment-Announcement--PR_495362',
          },
          {
            agency: 'Particula',
            value: 'AA+',
            reportUrl: 'https://particula.io/particula-rating-report-anemoy-ltf-september-2024/',
          },
          {
            agency: 'S&P Global',
            value: 'AAA+f/S1+',
            reportUrl:
              'https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3534006',
          },
        ],
      },
      {
        ...templateResource,
        resourceAddress: '0x3333333333333333333333333333333333333333',
        kind: 'centrifuge',
        name: 'Janus Henderson AAA CLO Fund',
        allocationMantissa: toMantissa(9720000),
        allocationUsdMantissa: toMantissa(9720000),
        apyRatio: '0.0512',
        liquidityMantissa: toMantissa(9720000),
        capMantissa: null,
        capUsdMantissa: null,
        lockEndTime: null,
        rewardsDistributors: [],
        exposure: [],
        ratings: [
          {
            agency: 'Particula',
            value: 'AAA',
            reportUrl:
              'https://particula.io/rating-reports/particula-rating-report-anemoy-jaaa-november-2025',
          },
        ],
      },
    ],
  };

  return {
    ...apiLiquidityHub,
    yieldGroups: [...apiLiquidityHub.yieldGroups, centrifugeYieldGroup],
  };
};
