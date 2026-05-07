import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import MAX_UINT256 from 'constants/maxUint256';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { legacyCorePool } from '__mocks__/models/pools';

import { useGetPools } from 'clients/api/queries/useGetPools';
import { useGetTokens } from 'libs/tokens';
import { renderComponent } from 'testUtils/render';
import type { Asset, InstitutionalVault, PendleVault, Token, VToken } from 'types';
import { VaultStatus, VaultType } from 'types';

import {
  useGetFixedRatedVaultUserStakedTokens,
  useGetFixedRatedVaults,
  useGetInstitutionalVaultUserMetrics,
} from 'clients/api';
import type { GetFixedRatedVaultsOutput } from 'clients/api/queries/getFixedRatedVaults/types';
import { type UseGetPendleVaultsOutput, useGetFormattedFixedRatedVaults } from '../index';

vi.mock('clients/api/queries/getFixedRatedVaults/useGetFixedRatedVaults');
vi.mock(
  'clients/api/queries/getFixedRatedVaultUserStakedTokens/useGetFixedRatedVaultUserStakedTokens',
);
vi.mock('clients/api/queries/getInstitutionalVaultUserMetrics/useGetInstitutionalVaultUserMetrics');
vi.mock('clients/api/queries/useGetPools');
vi.mock('libs/tokens');

// Real API response data from the /fixed-rate-vaults endpoint
const fakePendleVaultProduct: GetFixedRatedVaultsOutput[number] = {
  id: '56-pendle-0x6d3BD68E90B42615cb5abF4B8DE92b154ADc435e',
  chainId: '56',
  protocol: 'pendle',
  vaultAddress: '0x6d3BD68E90B42615cb5abF4B8DE92b154ADc435e',
  underlyingAssetAddress: '0xe052823b4aefc6e230FAf46231A57d0905E30AE0',
  fixedApyDecimal: '0.0339809766',
  maturityDate: '2026-06-25T00:00:00.000Z',
  protocolData: {
    ptDiscount: 0.00923603148159602,
    ptTokenSymbol: 'PT-clisBNB-25JUN2026',
    underlyingApy: 0.04487067325658617,
    liquidityCents: '742673002',
    ptTokenAddress: '0xe052823b4aefc6e230faf46231a57d0905e30ae0',
    startDate: '2025-10-09T09:04:39.000Z',
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
      tokenPrices: [],
    },
  ],
};

const fakeCeffuVaultProduct: GetFixedRatedVaultsOutput[number] = {
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
};

// Token for PT-clisBNB (the underlying asset of the vault)
const ptClisbnb: Token = {
  chainId: 56,
  address: '0xe052823b4aefc6e230FAf46231A57d0905E30AE0',
  decimals: 18,
  symbol: 'PT-clisBNB-25JUN2026',
  iconSrc: '',
};

// BNB token (the accounting/reward asset)
const bnbToken: Token = {
  chainId: 56,
  address: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  decimals: 18,
  symbol: 'BNB',
  isNative: true,
  iconSrc: '',
};

const mockUsdcToken: Token = {
  chainId: 97,
  address: '0x312e39c7641cE64BEccDe53613f07952258fa810',
  decimals: 6,
  symbol: 'MOCK_USDC',
  iconSrc: '',
};

// vToken matching the vault address
const vPtClisbnb: VToken = {
  chainId: 56,
  address: '0x6d3BD68E90B42615cb5abF4B8DE92b154ADc435e',
  decimals: 8,
  symbol: 'vPT-clisBNB-25JUN2026',
  underlyingToken: ptClisbnb,
};

// Asset for the pendle vault with realistic supply data
const pendleVaultAsset: Asset = {
  vToken: vPtClisbnb,
  supplyApyPercentage: new BigNumber('3.39809766'),
  borrowApyPercentage: new BigNumber('0'),
  collateralFactor: 0.7,
  userCollateralFactor: 0.7,
  liquidationPenaltyPercentage: 5,
  liquidationThresholdPercentage: 75,
  userLiquidationThresholdPercentage: 75,
  reserveFactor: 0.2,
  reserveTokens: new BigNumber(0),
  cashTokens: new BigNumber('1000'),
  tokenPriceCents: new BigNumber('65348.52516038'),
  tokenPriceOracleAddress: '0x0000000000000000000000000000000000000000',
  liquidityCents: new BigNumber(742673002),
  badDebtMantissa: 0n,
  supplierCount: 50,
  borrowerCount: 0,
  isBorrowable: false,
  isBorrowableByUser: false,
  exchangeRateVTokens: new BigNumber(1),
  userWalletBalanceTokens: new BigNumber('10'),
  userWalletBalanceCents: new BigNumber('653485'),
  userSupplyBalanceTokens: new BigNumber('5'),
  userSupplyBalanceCents: new BigNumber('326742'),
  userBorrowBalanceTokens: new BigNumber('0'),
  userBorrowBalanceCents: new BigNumber('0'),
  isCollateralOfUser: false,
  userBorrowLimitSharePercentage: 0,
  borrowCapTokens: MAX_UINT256,
  supplyCapTokens: MAX_UINT256,
  borrowBalanceCents: new BigNumber(0),
  supplyBalanceCents: new BigNumber(742673002),
  supplyBalanceTokens: new BigNumber('11364.5'),
  borrowBalanceTokens: new BigNumber('0'),
  disabledTokenActions: [],
  supplyTokenDistributions: [],
  borrowTokenDistributions: [],
  supplyPointDistributions: [],
  borrowPointDistributions: [],
};

const fakePoolsData = {
  pools: [
    {
      ...legacyCorePool,
      assets: [pendleVaultAsset],
    },
  ],
};

const fakeVaultProducts = [fakePendleVaultProduct, fakeCeffuVaultProduct];

describe('useGetFormattedFixedRatedVaults', () => {
  beforeEach(() => {
    (useGetTokens as Mock).mockReturnValue([ptClisbnb, bnbToken, mockUsdcToken]);

    (useGetFixedRatedVaults as Mock).mockReturnValue({
      data: fakeVaultProducts,
      isLoading: false,
    });

    (useGetPools as Mock).mockReturnValue({
      data: fakePoolsData,
      isLoading: false,
    });

    (useGetFixedRatedVaultUserStakedTokens as Mock).mockReturnValue({
      data: [
        {
          vaultAddress: fakeCeffuVaultProduct.vaultAddress,
          tokensMantissa: new BigNumber('100000000'),
        },
      ],
      isLoading: false,
    });

    (useGetInstitutionalVaultUserMetrics as Mock).mockReturnValue({
      data: [
        {
          vaultAddress: fakeCeffuVaultProduct.vaultAddress,
          maxRedeemAmountMantissa: new BigNumber('25000000'),
          maxWithdrawAmountMantissa: new BigNumber('50000000'),
        },
      ],
      isLoading: false,
    });
  });

  it('fetches and returns pendle and ceffu vaults correctly', async () => {
    let data: UseGetPendleVaultsOutput['data'] | undefined;
    let isLoading = false;

    const Wrapper = () => {
      ({ data, isLoading } = useGetFormattedFixedRatedVaults());
      return <div />;
    };

    renderComponent(<Wrapper />, {
      accountAddress: fakeAddress,
    });

    await waitFor(() => expect(!isLoading && data !== undefined).toBe(true));
    expect(data).toHaveLength(2);
    expect(data).toMatchSnapshot();
  });

  it('returns undefined when vault products are not loaded', () => {
    (useGetFixedRatedVaults as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    let data: UseGetPendleVaultsOutput['data'] | undefined;
    let isLoading = false;

    const Wrapper = () => {
      ({ data, isLoading } = useGetFormattedFixedRatedVaults());
      return <div />;
    };

    renderComponent(<Wrapper />, {
      accountAddress: fakeAddress,
    });

    expect(isLoading).toBe(true);
    expect(data).toBeUndefined();
  });

  it('returns undefined when pools are not loaded', () => {
    (useGetPools as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    let data: UseGetPendleVaultsOutput['data'] | undefined;
    let isLoading = false;

    const Wrapper = () => {
      ({ data, isLoading } = useGetFormattedFixedRatedVaults());
      return <div />;
    };

    renderComponent(<Wrapper />, {
      accountAddress: fakeAddress,
    });

    expect(isLoading).toBe(true);
    expect(data).toBeUndefined();
  });

  it('returns empty array when no vault products match pool assets', () => {
    (useGetFixedRatedVaults as Mock).mockReturnValue({
      data: [
        {
          ...fakePendleVaultProduct,
          vaultAddress: '0x0000000000000000000000000000000000000000',
        },
      ],
      isLoading: false,
    });

    let data: UseGetPendleVaultsOutput['data'] | undefined;
    let isLoading = false;

    const Wrapper = () => {
      ({ data, isLoading } = useGetFormattedFixedRatedVaults());
      return <div />;
    };

    renderComponent(<Wrapper />, {
      accountAddress: fakeAddress,
    });

    expect(isLoading).toBe(false);
    expect(data).toEqual([]);
  });

  it('sets status to Claim when maturity date has passed', () => {
    (useGetFixedRatedVaults as Mock).mockReturnValue({
      data: [
        {
          ...fakePendleVaultProduct,
          maturityDate: '2020-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
    });

    let data: UseGetPendleVaultsOutput['data'] | undefined;

    const Wrapper = () => {
      ({ data } = useGetFormattedFixedRatedVaults());
      return <div />;
    };

    renderComponent(<Wrapper />, {
      accountAddress: fakeAddress,
    });

    expect(data).toBeDefined();
    expect(data?.length).toBe(1);
    expect(data?.[0].status).toBe(VaultStatus.Claim);
  });

  it('sets status to Earning when user has supply balance and before maturity', () => {
    let data: UseGetPendleVaultsOutput['data'] | undefined;

    const Wrapper = () => {
      ({ data } = useGetFormattedFixedRatedVaults());
      return <div />;
    };

    renderComponent(<Wrapper />, {
      accountAddress: fakeAddress,
    });

    const pendleVault = data?.find(
      (vault): vault is PendleVault => vault.vaultType === VaultType.Pendle,
    );

    expect(pendleVault).toBeDefined();
    expect(pendleVault?.status).toBe(VaultStatus.Earning);
  });

  it('formats ceffu vault user metrics and status', () => {
    let data: UseGetPendleVaultsOutput['data'] | undefined;

    const Wrapper = () => {
      ({ data } = useGetFormattedFixedRatedVaults());
      return <div />;
    };

    renderComponent(<Wrapper />, {
      accountAddress: fakeAddress,
    });

    const ceffuVault = data?.find(
      (vault): vault is InstitutionalVault => vault.vaultType === VaultType.Institutional,
    );

    expect(ceffuVault).toBeDefined();
    expect(ceffuVault?.status).toBe(VaultStatus.Pending);
    expect(ceffuVault?.userStakeBalanceMantissa?.toFixed()).toBe('100000000');
    expect(ceffuVault?.userRedeemLimitMantissa.toFixed()).toBe('25000000');
    expect(ceffuVault?.userWithdrawLimitMantissa.toFixed()).toBe('50000000');
  });
});
