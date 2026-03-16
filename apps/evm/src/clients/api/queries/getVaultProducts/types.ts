import type { ChainId } from 'types';

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
  ptTokenAddress: string;
  accountingAsset: VaultProductAsset;
  ptTokenPriceUsd: number;
  underlyingAsset: VaultProductAsset;
  pendleMarketAddress: string;
};

type VaultProductUnderlyingToken = {
  address: string;
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
  vTokenAddress: string;
  underlyingAssetAddress: string;
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
