export enum ChainId {
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  ETHEREUM = 1,
  SEPOLIA = 11155111,
  OPBNB_MAINNET = 204,
  OPBNB_TESTNET = 5611,
  ARBITRUM_SEPOLIA = 421614,
  ARBITRUM_ONE = 42161,
  ZKSYNC_SEPOLIA = 300,
  ZKSYNC_MAINNET = 324,
}

export enum MainnetChainId {
  BSC_MAINNET = ChainId.BSC_MAINNET,
  ETHEREUM = ChainId.ETHEREUM,
  OPBNB_MAINNET = ChainId.OPBNB_MAINNET,
  ARBITRUM_ONE = ChainId.ARBITRUM_ONE,
  ZKSYNC_MAINNET = ChainId.ZKSYNC_MAINNET,
}

export enum TestnetChainId {
  BSC_TESTNET = ChainId.BSC_TESTNET,
  SEPOLIA = ChainId.SEPOLIA,
  OPBNB_TESTNET = ChainId.OPBNB_TESTNET,
  ARBITRUM_SEPOLIA = ChainId.ARBITRUM_SEPOLIA,
  ZKSYNC_SEPOLIA = ChainId.ZKSYNC_SEPOLIA,
}

export interface ChainMetadata {
  name: string;
  logoSrc: string;
  explorerUrl: string;
  nativeToken: Token;
  layerZeroScanUrl: string;
  corePoolComptrollerContractAddress: string;
  lstPoolVWstEthContractAddress?: string;
  lstPoolComptrollerContractAddress?: string;
  proposalExecutionGracePeriodMs?: number;
  blockTimeMs?: number;
  blocksPerDay?: number;
}

// TODO: import from @venusprotocol/tokens package once it's been created
export interface Token {
  symbol: string;
  decimals: number;
  asset: string;
  address: string;
  isNative?: boolean;
  tokenWrapped?: Token;
}
