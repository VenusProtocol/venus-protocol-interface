import { usdc, usdt, xvs } from '__mocks__/models/tokens';
import type { ImportableProtocol, ImportableSupplyPosition } from 'types';

export const importablePositions: {
  [protocol in ImportableProtocol]: ImportableSupplyPosition[];
} = {
  aave: [
    {
      aTokenAddress: `0xfakeA${xvs.symbol}Address`,
      protocol: 'aave',
      supplyApyPercentage: 99.99,
      tokenAddress: xvs.address,
      userATokenBalanceMantissa: 2000000000000000000000000000n,
      userSupplyBalanceMantissa: 4000000000000000000000000000n,
      userATokenBalanceWithInterestsMantissa: 4000000000000000000000000000n,
    },
    {
      aTokenAddress: `0xfakeA${usdc.symbol}Address`,
      protocol: 'aave',
      supplyApyPercentage: 0.01,
      tokenAddress: usdc.address,
      userATokenBalanceMantissa: 1000000000000000000000000000n,
      userSupplyBalanceMantissa: 5000000000000000000000000000n,
      userATokenBalanceWithInterestsMantissa: 5000000000000000000000000000n,
    },
    {
      aTokenAddress: `0xfakeA${usdt.symbol}Address`,
      protocol: 'aave',
      supplyApyPercentage: 0.15,
      tokenAddress: usdt.address,
      userATokenBalanceMantissa: 200000000000000000000000000n,
      userSupplyBalanceMantissa: 300000000000000000000000000n,
      userATokenBalanceWithInterestsMantissa: 300000000000000000000000000n,
    },
  ],
};
