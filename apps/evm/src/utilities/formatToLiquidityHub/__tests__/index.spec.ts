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
