import type { ChainId } from 'types';
import type { Address } from 'viem';

export type GetFixedRatedVaultsInput = {
  chainId: ChainId;
};

type FixedRatedVaultAsset = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  priceUsd: number;
};

type FixedRatedVaultProtocolData = {
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

type FixedRatedVaultUnderlyingToken = {
  address: Address;
  chainId: string;
  name: string | null;
  symbol: string | null;
  decimals: number;
  maturityDate: string;
  createdAt: string;
  updatedAt: string;
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
  underlyingToken: FixedRatedVaultUnderlyingToken[];
};

export type GetFixedRatedVaultsResponse = {
  result: FixedRatedVault[];
};

export type GetFixedRatedVaultsOutput = FixedRatedVault[];
