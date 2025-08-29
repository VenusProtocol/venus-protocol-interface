import type { Address } from 'viem';

// TODO: import from @venusprotocol/tokens package once it's been created
export interface Token {
  symbol: string;
  decimals: number;
  asset: string;
  address: Address;
  isNative?: boolean;
  tokenWrapped?: Token;
}

export interface VToken extends Omit<Token, 'isNative' | 'asset' | 'tokenWrapped'> {
  decimals: 8; // VBep tokens all have 8 decimals
  underlyingToken: Token;
  asset?: string;
}
