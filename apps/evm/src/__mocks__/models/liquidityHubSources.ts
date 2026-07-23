import BigNumber from 'bignumber.js';

import type { LiquidityHubSource } from 'types';

import { busd, lisUsd, usdc, usdt, xvs } from './tokens';

export const xvsCoreSource: LiquidityHubSource = {
  name: 'Core Pool',
  address: '0x4000000000000000000000000000000000000001',
  allocationTokens: new BigNumber(8000),
  allocationCents: new BigNumber(800000),
  allocationCapCents: new BigNumber(1600000),
  liquidityTokens: new BigNumber(6200),
  liquidityCents: new BigNumber(620000),
  supplyApyPercentage: new BigNumber(5.7),
  supplyTokenDistributions: [
    {
      type: 'venus',
      token: xvs,
      apyPercentage: new BigNumber(0.85),
      dailyDistributedTokens: new BigNumber(0.03),
      isActive: true,
    },
  ],
  collateralTokens: [xvs, usdc],
  lockEndDate: new Date('2026-08-01T00:00:00.000Z'),
};

export const xvsFluxSource: LiquidityHubSource = {
  name: 'Flux Vault',
  address: '0x4000000000000000000000000000000000000002',
  allocationTokens: new BigNumber(7250),
  allocationCents: new BigNumber(725000),
  allocationCapCents: new BigNumber(1450000),
  liquidityTokens: new BigNumber(5800),
  liquidityCents: new BigNumber(580000),
  supplyApyPercentage: new BigNumber(6.8),
  supplyTokenDistributions: [
    {
      type: 'venus',
      token: xvs,
      apyPercentage: new BigNumber(1.1),
      dailyDistributedTokens: new BigNumber(0.03),
      isActive: true,
    },
  ],
  collateralTokens: [xvs, usdt],
  lockEndDate: new Date('2026-09-15T00:00:00.000Z'),
};

export const usdcCoreSource: LiquidityHubSource = {
  name: 'Stable Core',
  address: '0x4000000000000000000000000000000000000003',
  allocationTokens: new BigNumber(175000),
  allocationCents: new BigNumber(17500000),
  allocationCapCents: new BigNumber(35000000),
  liquidityTokens: new BigNumber(140000),
  liquidityCents: new BigNumber(14000000),
  supplyApyPercentage: new BigNumber(3.9),
  supplyTokenDistributions: [
    {
      type: 'venus',
      token: xvs,
      apyPercentage: new BigNumber(0.45),
      dailyDistributedTokens: new BigNumber(0.3),
      isActive: true,
    },
  ],
  collateralTokens: [usdc, usdt, busd],
  lockEndDate: new Date('2026-07-22T00:00:00.000Z'),
};

export const usdcFluxSource: LiquidityHubSource = {
  name: 'Stable Flux',
  address: '0x4000000000000000000000000000000000000004',
  allocationTokens: new BigNumber(175000),
  allocationCents: new BigNumber(17500000),
  allocationCapCents: new BigNumber(35000000),
  liquidityTokens: new BigNumber(150000),
  liquidityCents: new BigNumber(15000000),
  supplyApyPercentage: new BigNumber(4.4),
  supplyTokenDistributions: [
    {
      type: 'venus',
      token: xvs,
      apyPercentage: new BigNumber(0.7),
      dailyDistributedTokens: new BigNumber(0.47),
      isActive: true,
    },
  ],
  collateralTokens: [usdc, lisUsd],
  lockEndDate: new Date('2026-10-10T00:00:00.000Z'),
};

export const usdtCoreSource: LiquidityHubSource = {
  name: 'USDT Core',
  address: '0x4000000000000000000000000000000000000005',
  allocationTokens: new BigNumber(90000),
  allocationCents: new BigNumber(9000000),
  allocationCapCents: new BigNumber(18000000),
  liquidityTokens: new BigNumber(76000),
  liquidityCents: new BigNumber(7600000),
  supplyApyPercentage: new BigNumber(4.3),
  supplyTokenDistributions: [
    {
      type: 'venus',
      token: xvs,
      apyPercentage: new BigNumber(0.55),
      dailyDistributedTokens: new BigNumber(0.19),
      isActive: true,
    },
  ],
  collateralTokens: [usdt, usdc],
  lockEndDate: new Date('2026-08-20T00:00:00.000Z'),
};

export const usdtFluxSource: LiquidityHubSource = {
  name: 'USDT Flux',
  address: '0x4000000000000000000000000000000000000006',
  allocationTokens: new BigNumber(120000),
  allocationCents: new BigNumber(12000000),
  allocationCapCents: new BigNumber(24000000),
  liquidityTokens: new BigNumber(90000),
  liquidityCents: new BigNumber(9000000),
  supplyApyPercentage: new BigNumber(5.1),
  supplyTokenDistributions: [
    {
      type: 'venus',
      token: xvs,
      apyPercentage: new BigNumber(0.9),
      dailyDistributedTokens: new BigNumber(0.41),
      isActive: true,
    },
  ],
  collateralTokens: [usdt, xvs],
  lockEndDate: new Date('2026-11-01T00:00:00.000Z'),
};

export const busdCoreSource: LiquidityHubSource = {
  name: 'Reserve Core',
  address: '0x4000000000000000000000000000000000000007',
  allocationTokens: new BigNumber(100000),
  allocationCents: new BigNumber(10000000),
  allocationCapCents: new BigNumber(20000000),
  liquidityTokens: new BigNumber(78000),
  liquidityCents: new BigNumber(7800000),
  supplyApyPercentage: new BigNumber(3.6),
  supplyTokenDistributions: [
    {
      type: 'venus',
      token: xvs,
      apyPercentage: new BigNumber(0.35),
      dailyDistributedTokens: new BigNumber(0.14),
      isActive: true,
    },
  ],
  collateralTokens: [busd, usdc],
  lockEndDate: new Date('2026-07-30T00:00:00.000Z'),
};

export const busdFluxSource: LiquidityHubSource = {
  name: 'Reserve Flux',
  address: '0x4000000000000000000000000000000000000008',
  allocationTokens: new BigNumber(80000),
  allocationCents: new BigNumber(8000000),
  allocationCapCents: new BigNumber(16000000),
  liquidityTokens: new BigNumber(63000),
  liquidityCents: new BigNumber(6300000),
  supplyApyPercentage: new BigNumber(4.2),
  supplyTokenDistributions: [
    {
      type: 'venus',
      token: xvs,
      apyPercentage: new BigNumber(0.6),
      dailyDistributedTokens: new BigNumber(0.18),
      isActive: true,
    },
  ],
  collateralTokens: [busd, lisUsd],
  lockEndDate: new Date('2026-09-05T00:00:00.000Z'),
};

export const liquidityHubSources = [
  xvsCoreSource,
  xvsFluxSource,
  usdcCoreSource,
  usdcFluxSource,
  usdtCoreSource,
  usdtFluxSource,
  busdCoreSource,
  busdFluxSource,
];
