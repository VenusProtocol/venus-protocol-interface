import liquidityHubsResponse from '__mocks__/api/liquidityHubs.json';
import { usdc, xvs } from '__mocks__/models/tokens';
import type { ApiLiquidityHub, ApiVenusReward } from 'types';

import { formatToLiquidityHub } from '..';

const hubAddress = '0x1000000000000000000000000000000000000001';
const tokenPriceOracleAddress = '0x2000000000000000000000000000000000000001';
const rewardsDistributorContractAddress = '0x3000000000000000000000000000000000000001';

const apiLiquidityHub: ApiLiquidityHub = {
  hubAddress,
  underlyingTokenAddress: usdc.address,
  name: 'USDC Liquidity Hub',
  symbol: 'vhUSDC',
  hubTokenDecimals: 18,
  underlyingTokenDecimals: usdc.decimals,
  tokenPriceOracleAddress,
  tokenPriceUsdMantissa: '1000000000000000000',
  totalUnderlyingMantissa: '200000000',
  totalUnderlyingUsdMantissa: '200000000000000000000',
  hubTokenSupplyMantissa: '0',
  exchangeRateMantissa: '0',
  pricePerShare: '1',
  blendedApyRatio: '0.05',
  rewardsDistributors: [],
  supplyCapacityMantissa: '1000000000',
  supplyCapacityUsdMantissa: '1000000000000000000000',
  liquidityMantissa: '100000000',
  liquidityUsdMantissa: '100000000000000000000',
  suppliersCount: 1,
  maxWithdrawalSizeMantissa: '100000000',
  managementFeeRatio: '0',
  performanceFeeRatio: '0',
  redeemFeeRatio: '0',
  isPaused: false,
  yieldGroups: [],
};

const apiRewardDistributor: ApiVenusReward = {
  marketAddress: hubAddress,
  rewardTokenAddress: xvs.address,
  lastRewardingSupplyBlockOrTimestamp: '0',
  lastRewardingBorrowBlockOrTimestamp: '0',
  supplySpeed: '10000000000000000',
  borrowSpeed: '0',
  supplyApyRatio: '0.01',
  borrowApyRatio: '0',
  priceMantissa: '2000000000000000000',
  rewardsDistributorContractAddress,
  isActive: true,
  rewardType: 'venus',
  rewardDetails: null,
};

describe('formatToLiquidityHub', () => {
  it('formats a Liquidity Hub', () => {
    const result = formatToLiquidityHub({
      apiLiquidityHub,
      tokens: [usdc],
    });

    expect(result).toMatchSnapshot();
  });

  it('formats user-specific supply and withdrawal caps', () => {
    const result = formatToLiquidityHub({
      apiLiquidityHub: {
        ...apiLiquidityHub,
        userMaxDepositMantissa: '250000000',
        userMaxWithdrawMantissa: '75000000',
        userMaxRedeemMantissa: '125000000000000000000',
      },
      tokens: [usdc],
    });

    expect(result).toMatchSnapshot();
  });

  it('calculates user yearly earnings from the user supply balance USD mantissa', () => {
    const result = formatToLiquidityHub({
      apiLiquidityHub: {
        ...apiLiquidityHub,
        userUnderlyingBalanceUsdMantissa: '100000000000000000000',
      },
      tokens: [usdc],
    });

    expect(result).toMatchSnapshot();
  });

  it('falls back to the token balance and token price', () => {
    const result = formatToLiquidityHub({
      apiLiquidityHub: {
        ...apiLiquidityHub,
        userUnderlyingBalanceMantissa: '100000000',
      },
      tokens: [usdc],
    });

    expect(result).toMatchSnapshot();
  });

  it('includes active supply reward APYs', () => {
    const result = formatToLiquidityHub({
      apiLiquidityHub: {
        ...apiLiquidityHub,
        rewardsDistributors: [apiRewardDistributor],
        userUnderlyingBalanceUsdMantissa: '100000000000000000000',
      },
      tokens: [usdc, xvs],
    });

    expect(result).toMatchSnapshot();
  });

  it('formats yield groups', () => {
    const result = formatToLiquidityHub({
      apiLiquidityHub: liquidityHubsResponse.result[0] as ApiLiquidityHub,
      tokens: [usdc, xvs],
    });

    expect(result).toMatchSnapshot();
  });

  it('calculates yield group supply cap value from the effective cap', () => {
    const result = formatToLiquidityHub({
      apiLiquidityHub: {
        ...(liquidityHubsResponse.result[0] as ApiLiquidityHub),
        yieldGroups: [
          {
            ...(liquidityHubsResponse.result[0] as ApiLiquidityHub).yieldGroups[0],
            absoluteCapUsdMantissa: '2000000000000000000000',
            effectiveCapMantissa: '400000000',
          },
        ],
      },
      tokens: [usdc, xvs],
    });

    expect(result?.yieldGroups[0]?.supplyCapTokens.isEqualTo(400)).toBe(true);
    expect(result?.yieldGroups[0]?.supplyCapCents.isEqualTo(100000)).toBe(true);
  });

  it('maps agency ratings onto the fund sources of a yield group', () => {
    const [apiYieldGroup] = (liquidityHubsResponse.result[0] as ApiLiquidityHub).yieldGroups;

    const result = formatToLiquidityHub({
      apiLiquidityHub: {
        ...(liquidityHubsResponse.result[0] as ApiLiquidityHub),
        yieldGroups: [
          {
            ...apiYieldGroup,
            kind: 'centrifuge',
            resources: [
              {
                ...apiYieldGroup.resources[0],
                creditRatings: [
                  {
                    agencyKey: 'moodys',
                    agencyName: "Moody's Ratings",
                    agencyIconUrl: 'https://static.example/moodys.jpeg',
                    agencyWebsiteUrl: 'https://ratings.moodys.com',
                    ratingLabel: 'Aa-bf',
                    ratingSourceUrl: 'https://moodys.example/report',
                  },
                  {
                    agencyKey: 'brandnew',
                    agencyName: 'Brand New Agency',
                    agencyIconUrl: null,
                    agencyWebsiteUrl: null,
                    ratingLabel: null,
                    ratingSourceUrl: null,
                  },
                ],
              },
            ],
          },
        ],
      },
      tokens: [usdc, xvs],
    });

    const ratings = result?.yieldGroups[0]?.sources[0]?.ratings;

    expect(ratings).toHaveLength(2);

    // agency names and rating labels are passed through untouched
    expect(ratings?.[0]?.agencyName).toBe("Moody's Ratings");
    expect(ratings?.[0]?.value).toBe('Aa-bf');
    expect(ratings?.[0]?.reportUrl).toBe('https://moodys.example/report');

    // the logo comes straight from the API
    expect(ratings?.[0]?.agencyIconSrc).toBe('https://static.example/moodys.jpeg');

    // a missing rating or report url becomes undefined, so the cell falls back to the placeholder
    // and the row renders without being clickable
    expect(ratings?.[1]?.value).toBeUndefined();
    expect(ratings?.[1]?.reportUrl).toBeUndefined();

    // an agency the API sends no logo for falls back to the placeholder, so the cell never breaks
    expect(ratings?.[1]?.agencyIconSrc).toBeTruthy();
  });

  it('skips ratings that carry no agency name', () => {
    const [apiYieldGroup] = (liquidityHubsResponse.result[0] as ApiLiquidityHub).yieldGroups;

    const result = formatToLiquidityHub({
      apiLiquidityHub: {
        ...(liquidityHubsResponse.result[0] as ApiLiquidityHub),
        yieldGroups: [
          {
            ...apiYieldGroup,
            resources: [
              {
                ...apiYieldGroup.resources[0],
                creditRatings: [
                  {
                    agencyKey: '',
                    agencyName: '',
                    agencyIconUrl: null,
                    agencyWebsiteUrl: null,
                    ratingLabel: 'AAA',
                    ratingSourceUrl: null,
                  },
                  {
                    agencyKey: 'particula',
                    agencyName: 'Particula',
                    agencyIconUrl: null,
                    agencyWebsiteUrl: null,
                    ratingLabel: 'AAA',
                    ratingSourceUrl: null,
                  },
                ],
              },
            ],
          },
        ],
      },
      tokens: [usdc, xvs],
    });

    expect(result?.yieldGroups[0]?.sources[0]?.ratings).toHaveLength(1);
    expect(result?.yieldGroups[0]?.sources[0]?.ratings[0]?.agencyName).toBe('Particula');
  });

  it('leaves fund sources without ratings when the API omits them', () => {
    const result = formatToLiquidityHub({
      apiLiquidityHub: liquidityHubsResponse.result[0] as ApiLiquidityHub,
      tokens: [usdc, xvs],
    });

    expect(result?.yieldGroups[0]?.sources[0]?.ratings).toEqual([]);
  });

  it('does not calculate user yearly earnings without a user supply balance', () => {
    const result = formatToLiquidityHub({
      apiLiquidityHub,
      tokens: [usdc],
    });

    expect(result).toMatchSnapshot();
  });

  it('returns zero yearly earnings for an explicit zero user supply balance', () => {
    const result = formatToLiquidityHub({
      apiLiquidityHub: {
        ...apiLiquidityHub,
        userUnderlyingBalanceUsdMantissa: '0',
      },
      tokens: [usdc],
    });

    expect(result).toMatchSnapshot();
  });
});
