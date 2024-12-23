import type { ChainId, Token, TokenAction } from 'types';
import type { Address } from 'viem';

export type TokenMapping = {
  [chainId in ChainId]: Token[];
};

export type DisabledTokenActionMapping = {
  [chainId in ChainId]: DisabledTokenAction[];
};

export interface DisabledTokenAction {
  address: string;
  disabledActions: TokenAction[];
}

export type VTokenLogo = string;

export type VTokenAssets = Record<Address, VTokenLogo>;
