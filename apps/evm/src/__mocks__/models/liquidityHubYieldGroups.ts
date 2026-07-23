import BigNumber from 'bignumber.js';

import type { LiquidityHubYieldGroup } from 'types';

import {
  busdCoreSource,
  busdFluxSource,
  usdcCoreSource,
  usdcFluxSource,
  usdtCoreSource,
  usdtFluxSource,
  xvsCoreSource,
  xvsFluxSource,
} from './liquidityHubSources';

export const xvsCoreYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000001',
  type: 'venusCore',
  name: 'Venus Core',
  bgClassName: 'bg-blue',
  allocationTokens: xvsCoreSource.allocationTokens,
  allocationCents: xvsCoreSource.allocationCents,
  allocationCapPercentage: new BigNumber(55),
  allocationCapTokens: new BigNumber(16000),
  allocationCapCents: xvsCoreSource.allocationCapCents,
  liquidityTokens: xvsCoreSource.liquidityTokens,
  liquidityCents: xvsCoreSource.liquidityCents,
  averageSupplyApyPercentage: xvsCoreSource.supplyApyPercentage,
  paused: false,
  sources: [xvsCoreSource, busdCoreSource],
};

export const xvsFluxYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000002',
  type: 'venusFlux',
  name: 'Venus Flux',
  bgClassName: 'bg-yellow',
  allocationTokens: xvsFluxSource.allocationTokens,
  allocationCents: xvsFluxSource.allocationCents,
  allocationCapPercentage: new BigNumber(45),
  allocationCapTokens: new BigNumber(14500),
  allocationCapCents: xvsFluxSource.allocationCapCents,
  liquidityTokens: xvsFluxSource.liquidityTokens,
  liquidityCents: xvsFluxSource.liquidityCents,
  averageSupplyApyPercentage: xvsFluxSource.supplyApyPercentage,
  paused: false,
  sources: [xvsFluxSource],
};

export const usdcCoreYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000003',
  type: 'venusCore',
  name: 'Venus Core',
  bgClassName: 'bg-blue',
  allocationTokens: usdcCoreSource.allocationTokens,
  allocationCents: usdcCoreSource.allocationCents,
  allocationCapPercentage: new BigNumber(60),
  allocationCapTokens: new BigNumber(350000),
  allocationCapCents: usdcCoreSource.allocationCapCents,
  liquidityTokens: usdcCoreSource.liquidityTokens,
  liquidityCents: usdcCoreSource.liquidityCents,
  averageSupplyApyPercentage: usdcCoreSource.supplyApyPercentage,
  paused: false,
  sources: [usdcCoreSource],
};

export const usdcFluxYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000004',
  type: 'venusFlux',
  name: 'Venus Flux',
  bgClassName: 'bg-yellow',
  allocationTokens: usdcFluxSource.allocationTokens,
  allocationCents: usdcFluxSource.allocationCents,
  allocationCapPercentage: new BigNumber(40),
  allocationCapTokens: new BigNumber(350000),
  allocationCapCents: usdcFluxSource.allocationCapCents,
  liquidityTokens: usdcFluxSource.liquidityTokens,
  liquidityCents: usdcFluxSource.liquidityCents,
  averageSupplyApyPercentage: usdcFluxSource.supplyApyPercentage,
  paused: false,
  sources: [usdcFluxSource],
};

export const usdtCoreYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000005',
  type: 'venusCore',
  name: 'Venus Core',
  bgClassName: 'bg-blue',
  allocationTokens: usdtCoreSource.allocationTokens,
  allocationCents: usdtCoreSource.allocationCents,
  allocationCapPercentage: new BigNumber(50),
  allocationCapTokens: new BigNumber(180000),
  allocationCapCents: usdtCoreSource.allocationCapCents,
  liquidityTokens: usdtCoreSource.liquidityTokens,
  liquidityCents: usdtCoreSource.liquidityCents,
  averageSupplyApyPercentage: usdtCoreSource.supplyApyPercentage,
  paused: false,
  sources: [usdtCoreSource],
};

export const usdtFluxYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000006',
  type: 'venusFlux',
  name: 'Venus Flux',
  bgClassName: 'bg-yellow',
  allocationTokens: usdtFluxSource.allocationTokens,
  allocationCents: usdtFluxSource.allocationCents,
  allocationCapPercentage: new BigNumber(50),
  allocationCapTokens: new BigNumber(240000),
  allocationCapCents: usdtFluxSource.allocationCapCents,
  liquidityTokens: usdtFluxSource.liquidityTokens,
  liquidityCents: usdtFluxSource.liquidityCents,
  averageSupplyApyPercentage: usdtFluxSource.supplyApyPercentage,
  paused: false,
  sources: [usdtFluxSource],
};

export const busdCoreYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000007',
  type: 'venusCore',
  name: 'Venus Core',
  bgClassName: 'bg-blue',
  allocationTokens: busdCoreSource.allocationTokens,
  allocationCents: busdCoreSource.allocationCents,
  allocationCapPercentage: new BigNumber(65),
  allocationCapTokens: new BigNumber(200000),
  allocationCapCents: busdCoreSource.allocationCapCents,
  liquidityTokens: busdCoreSource.liquidityTokens,
  liquidityCents: busdCoreSource.liquidityCents,
  averageSupplyApyPercentage: busdCoreSource.supplyApyPercentage,
  paused: false,
  sources: [busdCoreSource],
};

export const busdFluxYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000008',
  type: 'venusFlux',
  name: 'Venus Flux',
  bgClassName: 'bg-yellow',
  allocationTokens: busdFluxSource.allocationTokens,
  allocationCents: busdFluxSource.allocationCents,
  allocationCapPercentage: new BigNumber(35),
  allocationCapTokens: new BigNumber(160000),
  allocationCapCents: busdFluxSource.allocationCapCents,
  liquidityTokens: busdFluxSource.liquidityTokens,
  liquidityCents: busdFluxSource.liquidityCents,
  averageSupplyApyPercentage: busdFluxSource.supplyApyPercentage,
  paused: false,
  sources: [busdFluxSource],
};

export const liquidityHubYieldGroups = [
  xvsCoreYieldGroup,
  xvsFluxYieldGroup,
  usdcCoreYieldGroup,
  usdcFluxYieldGroup,
  usdtCoreYieldGroup,
  usdtFluxYieldGroup,
  busdCoreYieldGroup,
  busdFluxYieldGroup,
];
