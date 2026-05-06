import BigNumber from 'bignumber.js';
import type { GetFixedRatedVaultsOutput } from 'clients/api/queries/getFixedRatedVaults';

import {
  type InstitutionalVault,
  type LockedDeposit,
  VaultCategory,
  VaultManager,
  VaultStatus,
  VaultType,
  type VenusVault,
} from 'types';

import type { Address } from 'viem';
import { usdc, vai, xvs } from './tokens';

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
    stakeBalanceMantissa: new BigNumber('415000000000000000000'),
    stakeBalanceCents: 41500,
    stakingAprPercentage: 12665.060240963856,
    category: VaultCategory.STABLECOINS,
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
    stakeBalanceMantissa: new BigNumber('400000000000000000000000000'),
    stakeBalanceCents: 40000000000,
    stakingAprPercentage: 12.92281835063781,
    userStakeBalanceMantissa: new BigNumber('233000000000000000000'),
    userStakeBalanceCents: 23300,
    category: VaultCategory.GOVERNANCE,
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
        tokenPrices: [
          {
            id: 'fake-price-pendle',
            tokenAddress: '0xe052823b4aefc6e230FAf46231A57d0905E30AE0',
            tokenWrappedAddress: null,
            chainId: '56',
            priceMantissa: '682687557196753800000000000000000000000',
            priceSource: 'oracle',
            priceOracleAddress: '0x0000000000000000000000000000000000000001',
            mainOracleAddress: '0x0000000000000000000000000000000000000001',
            mainOracleName: 'ResilientOracle',
            isPriceInvalid: false,
            hasErrorFetchingPrice: false,
            createdAt: '2026-01-21T20:14:15.000Z',
            updatedAt: '2026-01-21T20:14:15.000Z',
          },
        ],
      },
    ],
  },
  {
    id: '97-institutional-0x5263D68786AaCfad74B9aa385A004c272548e8B7',
    chainId: '97',
    protocol: 'institutional-vault',
    vaultAddress: '0x5263D68786AaCfad74B9aa385A004c272548e8B7',
    underlyingAssetAddress: '0x312e39c7641cE64BEccDe53613f07952258fa810',
    fixedApyDecimal: '0.08',
    maturityDate: '2026-09-01T00:00:00.000Z',
    protocolData: {
      collateralAssetAddress: '0xCC3933141a64E26C9317b19CE4BbB4ec2c333bc6',
      institutionOperatorAddress: '0x1111111111111111111111111111111111111111',
      latePenaltyRateMantissa: '0',
      lockDurationSeconds: 2592000,
      openDurationSeconds: 604800,
      settlementWindowSeconds: 259200,
    },
    createdAt: '2026-04-01T00:00:00.000Z',
    updatedAt: '2026-04-01T00:00:00.000Z',
    loanVaultDetail: {
      chainId: '97',
      collateralAssetAddress: '0xCC3933141a64E26C9317b19CE4BbB4ec2c333bc6',
      collateralValueCents: '0',
      createdAt: '2026-04-01T00:00:00.000Z',
      debtValueCents: '0',
      fixedRateVaultId: '97-institutional-0x5263D68786AaCfad74B9aa385A004c272548e8B7',
      id: 'loan-vault-detail-1',
      institutionAddress: '0x1111111111111111111111111111111111111111',
      latePenaltyRateMantissa: '0',
      liquidationIncentiveMantissa: '0',
      liquidationThresholdMantissa: '0',
      liquidityMantissa: '500000000000',
      lockEndTime: '2026-08-29T00:00:00.000Z',
      maxBorrowCapMantissa: '1000000000000',
      minBorrowCapMantissa: '100000000000',
      openEndTime: '2026-04-08T00:00:00.000Z',
      outstandingDebtMantissa: '0',
      reserveFactorMantissa: '0',
      settlementDeadline: '2026-09-01T00:00:00.000Z',
      shortfallMantissa: '0',
      supplyAssetAddress: '0x312e39c7641cE64BEccDe53613f07952258fa810',
      totalOwedMantissa: '0',
      totalRaisedMantissa: '500000000000',
      updatedAt: '2026-04-01T00:00:00.000Z',
      vaultState: 2,
    },
    underlyingToken: [
      {
        address: '0x312e39c7641cE64BEccDe53613f07952258fa810',
        chainId: '97',
        name: 'Mock USDC',
        symbol: 'MOCK_USDC',
        decimals: 6,
        maturityDate: '2026-09-01T00:00:00.000Z',
        createdAt: '2026-04-01T00:00:00.000Z',
        updatedAt: '2026-04-01T00:00:00.000Z',
        tokenPrices: [
          {
            id: 'fake-price-institutional',
            tokenAddress: '0x312e39c7641cE64BEccDe53613f07952258fa810',
            tokenWrappedAddress: null,
            chainId: '97',
            priceMantissa: '1000000000000000000000000000000',
            priceSource: 'oracle',
            priceOracleAddress: '0x0000000000000000000000000000000000000001',
            mainOracleAddress: '0x0000000000000000000000000000000000000001',
            mainOracleName: 'ResilientOracle',
            isPriceInvalid: false,
            hasErrorFetchingPrice: false,
            createdAt: '2026-04-01T00:00:00.000Z',
            updatedAt: '2026-04-01T00:00:00.000Z',
          },
        ],
      },
    ],
  },
];

export const institutionalVault: InstitutionalVault = {
  vaultType: VaultType.Institutional,
  category: VaultCategory.STABLECOINS,
  manager: VaultManager.Ceffu,
  managerIcon: 'ceefu',
  managerAddress: '0x1111111111111111111111111111111111111111',
  managerLink: 'https://www.ceffu.com',
  status: VaultStatus.Pending,
  key: '97-institutional-0x5263D68786AaCfad74B9aa385A004c272548e8B7',
  stakedToken: usdc,
  rewardToken: usdc,
  stakedTokenPriceCents: new BigNumber(100),
  rewardTokenPriceCents: new BigNumber(100),
  stakingAprPercentage: 8,
  stakeBalanceMantissa: new BigNumber('500000000000'),
  stakeBalanceCents: 50000000,
  userStakeBalanceMantissa: new BigNumber('100000000'),
  userStakeBalanceCents: 10000,
  vaultAddress: '0x5263D68786AaCfad74B9aa385A004c272548e8B7',
  fixedApyDecimal: '0.08',
  vaultDeploymentDate: new Date('2026-04-01T00:00:00.000Z'),
  openEndDate: new Date('2026-04-08T00:00:00.000Z'),
  lockEndDate: new Date('2026-08-29T00:00:00.000Z'),
  maturityDate: new Date('2026-09-01T00:00:00.000Z'),
  settlementDate: new Date('2026-09-01T00:00:00.000Z'),
  stakeLimitMantissa: new BigNumber('1000000000000'),
  stakeMinMantissa: new BigNumber('100000000000'),
  userRedeemLimitMantissa: new BigNumber(0),
  userWithdrawLimitMantissa: new BigNumber(0),
  lockingPeriodMs: 2592000 * 1000,
};

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
