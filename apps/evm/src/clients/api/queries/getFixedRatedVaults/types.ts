import type { ChainId } from 'types';
import type { Address } from 'viem';

export type GetFixedRatedVaultsInput = {
  chainId: ChainId;
  includeExpired?: boolean;
};

type FixedRatedVaultAsset = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  priceUsd: number;
};

export type PendleVaultProtocolData = {
  startDate: string;
  ptDiscount: number;
  ptTokenSymbol: string;
  underlyingApy: number;
  liquidityCents: string;
  ptTokenAddress: Address;
  accountingAsset: FixedRatedVaultAsset;
  ptTokenPriceUsd: number;
  underlyingAsset: FixedRatedVaultAsset;
  pendleMarketAddress: Address;
};

export type InstitutionalVaultProtocolData = {
  collateralAssetAddress: Address;
  institutionOperatorAddress: Address;
  latePenaltyRateMantissa: string;
  lockDurationSeconds: number;
  openDurationSeconds: number;
  settlementWindowSeconds: number;
};

type FixedRatedVaultProtocolData = PendleVaultProtocolData | InstitutionalVaultProtocolData;

type FixedRatedVaultUnderlyingToken = {
  address: Address;
  chainId: string;
  name: string | null;
  symbol: string | null;
  decimals: number;
  maturityDate: string;
  createdAt: string;
  updatedAt: string;
  tokenPrices: {
    id: string;
    tokenAddress: Address;
    tokenWrappedAddress: Address | null;
    chainId: string;
    priceMantissa: string;
    priceSource: string;
    priceOracleAddress: Address;
    mainOracleAddress: Address;
    mainOracleName: string;
    isPriceInvalid: boolean;
    hasErrorFetchingPrice: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
};

export type LoanVaultDetail = {
  chainId: string;
  collateralAssetAddress: Address;
  collateralValueCents: string;
  createdAt: string;
  debtValueCents: string;
  fixedRateVaultId: string;
  id: string;
  institutionAddress: Address;
  latePenaltyRateMantissa: string;
  liquidationIncentiveMantissa: string;
  liquidationThresholdMantissa: string;
  liquidityMantissa: string;
  lockEndTime: string;
  maxBorrowCapMantissa: string;
  minBorrowCapMantissa: string;
  openEndTime: string;
  outstandingDebtMantissa: string;
  reserveFactorMantissa: string;
  settlementDeadline: string;
  shortfallMantissa: string;
  supplyAssetAddress: Address;
  totalOwedMantissa: string;
  totalRaisedMantissa: string;
  updatedAt: string;
  vaultState: number;
};

type FixedRatedVault = {
  id: string;
  chainId: string;
  protocol: string;
  vaultAddress: Address;
  underlyingAssetAddress: Address;
  fixedApyDecimal: string;
  maturityDate: string;
  protocolData: FixedRatedVaultProtocolData;
  createdAt: string;
  updatedAt: string;
  loanVaultDetail?: LoanVaultDetail;
  underlyingToken: FixedRatedVaultUnderlyingToken[];
};

export type GetFixedRatedVaultsResponse = {
  result: FixedRatedVault[];
};

export type GetFixedRatedVaultsOutput = FixedRatedVault[];
