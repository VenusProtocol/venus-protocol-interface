import BigNumber from 'bignumber.js';

import venusCoreIconSrc from 'assets/img/venusCoreIcon.png';
import venusFluxIconSrc from 'assets/img/venusFluxIcon.png';
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
  type: 'core',
  nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.core',
  iconSrc: venusCoreIconSrc,
  bgClassName: 'bg-blue',
  allocationTokens: xvsCoreSource.allocationTokens,
  allocationCents: xvsCoreSource.allocationCents,
  allocationCapPercentage: new BigNumber(55),
  supplyCapTokens: new BigNumber(16000),
  supplyCapCents: xvsCoreSource.supplyCapCents,
  liquidityTokens: xvsCoreSource.liquidityTokens,
  liquidityCents: xvsCoreSource.liquidityCents,
  averageSupplyApyPercentage: xvsCoreSource.supplyApyPercentage,
  paused: false,
  sources: [xvsCoreSource, busdCoreSource],
};

export const xvsFluxYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000002',
  type: 'flux',
  nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.flux',
  iconSrc: venusFluxIconSrc,
  bgClassName: 'bg-yellow',
  allocationTokens: xvsFluxSource.allocationTokens,
  allocationCents: xvsFluxSource.allocationCents,
  allocationCapPercentage: new BigNumber(45),
  supplyCapTokens: new BigNumber(14500),
  supplyCapCents: xvsFluxSource.supplyCapCents,
  liquidityTokens: xvsFluxSource.liquidityTokens,
  liquidityCents: xvsFluxSource.liquidityCents,
  averageSupplyApyPercentage: xvsFluxSource.supplyApyPercentage,
  paused: false,
  sources: [xvsFluxSource],
};

export const usdcCoreYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000003',
  type: 'core',
  nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.core',
  iconSrc: venusCoreIconSrc,
  bgClassName: 'bg-blue',
  allocationTokens: usdcCoreSource.allocationTokens,
  allocationCents: usdcCoreSource.allocationCents,
  allocationCapPercentage: new BigNumber(60),
  supplyCapTokens: new BigNumber(350000),
  supplyCapCents: usdcCoreSource.supplyCapCents,
  liquidityTokens: usdcCoreSource.liquidityTokens,
  liquidityCents: usdcCoreSource.liquidityCents,
  averageSupplyApyPercentage: usdcCoreSource.supplyApyPercentage,
  paused: false,
  sources: [usdcCoreSource],
};

export const usdcFluxYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000004',
  type: 'flux',
  nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.flux',
  iconSrc: venusFluxIconSrc,
  bgClassName: 'bg-yellow',
  allocationTokens: usdcFluxSource.allocationTokens,
  allocationCents: usdcFluxSource.allocationCents,
  allocationCapPercentage: new BigNumber(40),
  supplyCapTokens: new BigNumber(350000),
  supplyCapCents: usdcFluxSource.supplyCapCents,
  liquidityTokens: usdcFluxSource.liquidityTokens,
  liquidityCents: usdcFluxSource.liquidityCents,
  averageSupplyApyPercentage: usdcFluxSource.supplyApyPercentage,
  paused: false,
  sources: [usdcFluxSource],
};

export const usdtCoreYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000005',
  type: 'core',
  nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.core',
  iconSrc: venusCoreIconSrc,
  bgClassName: 'bg-blue',
  allocationTokens: usdtCoreSource.allocationTokens,
  allocationCents: usdtCoreSource.allocationCents,
  allocationCapPercentage: new BigNumber(50),
  supplyCapTokens: new BigNumber(180000),
  supplyCapCents: usdtCoreSource.supplyCapCents,
  liquidityTokens: usdtCoreSource.liquidityTokens,
  liquidityCents: usdtCoreSource.liquidityCents,
  averageSupplyApyPercentage: usdtCoreSource.supplyApyPercentage,
  paused: false,
  sources: [usdtCoreSource],
};

export const usdtFluxYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000006',
  type: 'flux',
  nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.flux',
  iconSrc: venusFluxIconSrc,
  bgClassName: 'bg-yellow',
  allocationTokens: usdtFluxSource.allocationTokens,
  allocationCents: usdtFluxSource.allocationCents,
  allocationCapPercentage: new BigNumber(50),
  supplyCapTokens: new BigNumber(240000),
  supplyCapCents: usdtFluxSource.supplyCapCents,
  liquidityTokens: usdtFluxSource.liquidityTokens,
  liquidityCents: usdtFluxSource.liquidityCents,
  averageSupplyApyPercentage: usdtFluxSource.supplyApyPercentage,
  paused: false,
  sources: [usdtFluxSource],
};

export const busdCoreYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000007',
  type: 'core',
  nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.core',
  iconSrc: venusCoreIconSrc,
  bgClassName: 'bg-blue',
  allocationTokens: busdCoreSource.allocationTokens,
  allocationCents: busdCoreSource.allocationCents,
  allocationCapPercentage: new BigNumber(65),
  supplyCapTokens: new BigNumber(200000),
  supplyCapCents: busdCoreSource.supplyCapCents,
  liquidityTokens: busdCoreSource.liquidityTokens,
  liquidityCents: busdCoreSource.liquidityCents,
  averageSupplyApyPercentage: busdCoreSource.supplyApyPercentage,
  paused: false,
  sources: [busdCoreSource],
};

export const busdFluxYieldGroup: LiquidityHubYieldGroup = {
  address: '0x5000000000000000000000000000000000000008',
  type: 'flux',
  nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.flux',
  iconSrc: venusFluxIconSrc,
  bgClassName: 'bg-yellow',
  allocationTokens: busdFluxSource.allocationTokens,
  allocationCents: busdFluxSource.allocationCents,
  allocationCapPercentage: new BigNumber(35),
  supplyCapTokens: new BigNumber(160000),
  supplyCapCents: busdFluxSource.supplyCapCents,
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
