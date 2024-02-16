export enum ChainId {
  'BSC_MAINNET' = 56,
  'BSC_TESTNET' = 97,
  'ETHEREUM' = 1,
  'SEPOLIA' = 11155111,
  'OPBNB_TESTNET' = 5611,
}

export interface ChainMetadata {
  name: string;
  logoSrc: string;
  blockTimeMs: number;
  blocksPerDay: number;
  explorerUrl: string;
  corePoolComptrollerContractAddress: string;
  nativeToken: Token;
  layerZeroScanUrl: string;
}

export interface Token {
  symbol: string;
  decimals: number;
  asset: string;
  address: string;
  isNative?: boolean;
  wrapsNative?: boolean;
}

export interface VToken extends Omit<Token, 'isNative' | 'asset'> {
  decimals: 8; // VBep tokens all have 8 decimals
  underlyingToken: Token;
}

export type TokenMapping = {
  [chainId in ChainId]: Token[];
};

export type TokenAction = 'swapAndSupply' | 'supply' | 'withdraw' | 'borrow' | 'repay';

export interface DisabledTokenAction {
  address: string;
  disabledActions: TokenAction[];
}
