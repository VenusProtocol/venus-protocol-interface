import BigNumber from 'bignumber.js';
import type { GetFixedRatedVaultsOutput } from 'clients/api/queries/getFixedRatedVaults';

import {
  type LockedDeposit,
  VaultCategory,
  VaultManager,
  VaultStatus,
  VaultType,
  type VenusVault,
} from 'types';

import type { Address } from 'viem';
import { vai, xvs } from './tokens';

export const vaults: VenusVault[] = [
  {
    rewardToken: xvs,
    stakedToken: vai,
    isPaused: false,
    lockingPeriodMs: 300000,
    stakedTokenPriceCents: new BigNumber(100),
    rewardTokenPriceCents: new BigNumber(100),
    dailyEmissionMantissa: new BigNumber('144000000000000000000'),
    dailyEmissionCents: 14400,
    totalStakedMantissa: new BigNumber('415000000000000000000'),
    totalStakedCents: 41500,
    stakingAprPercentage: 12665.060240963856,
    category: VaultCategory.Stablecoins,
    vaultType: VaultType.Venus,
    manager: VaultManager.Venus,
    managerIcon: 'logoMobile',
    status: VaultStatus.Active,
    key: 'venus-VAI-XVS-300000',
  },
  {
    rewardToken: xvs,
    stakedToken: xvs,
    isPaused: false,
    lockingPeriodMs: 300000,
    stakedTokenPriceCents: new BigNumber(100),
    rewardTokenPriceCents: new BigNumber(100),
    dailyEmissionMantissa: new BigNumber('144000000000000000000'),
    dailyEmissionCents: 14400,
    totalStakedMantissa: new BigNumber('400000000000000000000000000'),
    totalStakedCents: 40000000000,
    stakingAprPercentage: 12.92281835063781,
    userStakedMantissa: new BigNumber('233000000000000000000'),
    userStakedCents: 23300,
    category: VaultCategory.Others,
    vaultType: VaultType.Venus,
    manager: VaultManager.Venus,
    managerIcon: 'logoMobile',
    status: VaultStatus.Active,
    key: 'venus-XVS-XVS-300000',
  },
];

export const fixedRatedVaults: GetFixedRatedVaultsOutput = [
  {
    id: '56-pendle-0x6d3BD68E90B42615cb5abF4B8DE92b154ADc435e',
    chainId: '56',
    protocol: 'pendle',
    vaultAddress: '0x6d3BD68E90B42615cb5abF4B8DE92b154ADc435e',
    underlyingAssetAddress: '0xe052823b4aefc6e230FAf46231A57d0905E30AE0',
    fixedApyDecimal: '0.0339809766',
    maturityDate: '2026-06-25T00:00:00.000Z',
    protocolData: {
      startDate: '2025-10-09T09:04:39.000Z',
      ptDiscount: 0.00923603148159602,
      ptTokenSymbol: 'PT-clisBNB-25JUN2026',
      underlyingApy: 0.04487067325658617,
      liquidityCents: '742673002',
      ptTokenAddress: '0xe052823b4aefc6e230faf46231a57d0905e30ae0',
      accountingAsset: {
        name: 'BNB',
        symbol: 'BNB',
        address: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        decimals: 18,
        priceUsd: 660.36349666,
      },
      ptTokenPriceUsd: 653.4852516038151,
      underlyingAsset: {
        name: 'slisBNB',
        symbol: 'slisBNB',
        address: '0xb0b84d294e0c75a6abe60171b70edeb2efd14a1b',
        decimals: 18,
        priceUsd: 682.6875571967538,
      },
      pendleMarketAddress: '0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5',
    },
    createdAt: '2026-03-13T02:16:23.000Z',
    updatedAt: '2026-03-15T15:38:02.000Z',
    underlyingToken: [
      {
        address: '0xe052823b4aefc6e230FAf46231A57d0905E30AE0',
        chainId: '56',
        name: null,
        symbol: null,
        decimals: 18,
        maturityDate: '2026-06-25T00:00:00.000Z',
        createdAt: '2026-01-21T20:14:15.000Z',
        updatedAt: '2026-01-21T20:14:15.000Z',
      },
    ],
  },
];

export const lockedDeposits: LockedDeposit[] = [
  {
    amountMantissa: new BigNumber('1000000000000000000'),
    unlockedAt: new Date('2022-06-29T10:43:24.000Z'),
  },
  {
    amountMantissa: new BigNumber('2000000000000000000'),
    unlockedAt: new Date('2022-06-30T14:30:04.000Z'),
  },
  {
    amountMantissa: new BigNumber('3000000000000000000'),
    unlockedAt: new Date('2022-07-01T18:16:44.000Z'),
  },
];

export const xvsVaultPoolInfo: {
  stakedTokenAddress: Address;
  allocationPoint: number;
  lastRewardBlock: number;
  accRewardPerShare: BigNumber;
  lockingPeriodMs: number;
} = {
  stakedTokenAddress: xvs.address,
  allocationPoint: 10,
  lastRewardBlock: 100000,
  accRewardPerShare: new BigNumber(123871680),
  lockingPeriodMs: 200000,
};

export const xvsVaultUserInfo: {
  stakedAmountMantissa: BigNumber;
  pendingWithdrawalsTotalAmountMantissa: BigNumber;
  rewardDebtAmountMantissa: BigNumber;
} = {
  stakedAmountMantissa: new BigNumber('30000000000000000000'),
  pendingWithdrawalsTotalAmountMantissa: new BigNumber('1000000000000000000'),
  rewardDebtAmountMantissa: new BigNumber('2000000000000000000'),
};
