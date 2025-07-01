import { busd, usdc, usdt, weth, xvs } from '__mocks__/models/tokens';
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
      userATokenBalanceMantissa: 20000000000000000000n,
      userATokenBalanceWithInterestsMantissa: 24000000000000000000n,
      userSupplyBalanceMantissa: 40000000000000000000n,
    },
    {
      aTokenAddress: `0xfakeA${usdc.symbol}Address`,
      protocol: 'aave',
      supplyApyPercentage: 0.01,
      tokenAddress: usdc.address,
      userATokenBalanceMantissa: 10000000n,
      userATokenBalanceWithInterestsMantissa: 12000000n,
      userSupplyBalanceMantissa: 50000000n,
    },
    {
      aTokenAddress: `0xfakeA${usdt.symbol}Address`,
      protocol: 'aave',
      supplyApyPercentage: 0.15,
      tokenAddress: usdt.address,
      userATokenBalanceMantissa: 10000000n,
      userATokenBalanceWithInterestsMantissa: 12000000n,
      userSupplyBalanceMantissa: 50000000n,
    },
    {
      aTokenAddress: `0xfakeA${busd.symbol}Address`,
      protocol: 'aave',
      supplyApyPercentage: 0.02,
      tokenAddress: busd.address,
      userATokenBalanceMantissa: 1n,
      userATokenBalanceWithInterestsMantissa: 1n,
      userSupplyBalanceMantissa: 1n,
    },
    {
      aTokenAddress: `0xfakeA${weth.symbol}Address`,
      protocol: 'aave',
      supplyApyPercentage: 0.09,
      tokenAddress: weth.address,
      userATokenBalanceMantissa: 180000000000000000000n,
      userATokenBalanceWithInterestsMantissa: 186000000000000000000n,
      userSupplyBalanceMantissa: 200000000000000000000n,
    },
  ],
};
