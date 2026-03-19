import type { ChainId } from 'types';
import type { Address } from 'viem';

export type GetVaultProductsInput = {
  chainId: ChainId;
};

type VaultProductAsset = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  priceUsd: number;
};

type VaultProductProtocolData = {
  ptDiscount: number;
  ptTokenSymbol: string;
  underlyingApy: number;
  liquidityCents: string;
  ptTokenAddress: Address;
  accountingAsset: VaultProductAsset;
  ptTokenPriceUsd: number;
  underlyingAsset: VaultProductAsset;
  pendleMarketAddress: Address;
};

type VaultProductUnderlyingToken = {
  address: Address;
  chainId: string;
  name: string | null;
  symbol: string | null;
  decimals: number;
  maturityDate: string;
  createdAt: string;
  updatedAt: string;
};

type VaultProduct = {
  id: string;
  chainId: string;
  protocol: string;
  vaultAddress: Address;
  underlyingAssetAddress: Address;
  fixedApyDecimal: string;
  maturityDate: string;
  protocolData: VaultProductProtocolData;
  createdAt: string;
  updatedAt: string;
  underlyingToken: VaultProductUnderlyingToken[];
};

export type GetVaultProductsResponse = {
  result: VaultProduct[];
};

export type GetVaultProductsOutput = VaultProduct[];
