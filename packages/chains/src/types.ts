import type { Address } from 'viem';

export enum ChainId {
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  ETHEREUM = 1,
  SEPOLIA = 11155111,
  OPBNB_MAINNET = 204,
  OPBNB_TESTNET = 5611,
  ARBITRUM_ONE = 42161,
  ARBITRUM_SEPOLIA = 421614,
  ZKSYNC_MAINNET = 324,
  ZKSYNC_SEPOLIA = 300,
  OPTIMISM_MAINNET = 10,
  OPTIMISM_SEPOLIA = 11155420,
  BASE_MAINNET = 8453,
  BASE_SEPOLIA = 84532,
  UNICHAIN_MAINNET = 130,
  UNICHAIN_SEPOLIA = 1301,
}

export enum MainnetChainId {
  BSC_MAINNET = ChainId.BSC_MAINNET,
  ETHEREUM = ChainId.ETHEREUM,
  OPBNB_MAINNET = ChainId.OPBNB_MAINNET,
  ARBITRUM_ONE = ChainId.ARBITRUM_ONE,
  ZKSYNC_MAINNET = ChainId.ZKSYNC_MAINNET,
  OPTIMISM_MAINNET = ChainId.OPTIMISM_MAINNET,
  BASE_MAINNET = ChainId.BASE_MAINNET,
  UNICHAIN_MAINNET = ChainId.UNICHAIN_MAINNET,
}

export enum TestnetChainId {
  BSC_TESTNET = ChainId.BSC_TESTNET,
  SEPOLIA = ChainId.SEPOLIA,
  OPBNB_TESTNET = ChainId.OPBNB_TESTNET,
  ARBITRUM_SEPOLIA = ChainId.ARBITRUM_SEPOLIA,
  ZKSYNC_SEPOLIA = ChainId.ZKSYNC_SEPOLIA,
  OPTIMISM_SEPOLIA = ChainId.OPTIMISM_SEPOLIA,
  BASE_SEPOLIA = ChainId.BASE_SEPOLIA,
  UNICHIAN_SEPOLIA = ChainId.UNICHAIN_SEPOLIA,
}

export interface ChainMetadata {
  name: string;
  logoSrc: string;
  explorerUrl: string;
  nativeToken: Token;
  layerZeroScanUrl: string;
  corePoolComptrollerContractAddress: Address;
  safeWalletApiUrl?: string;
  lstPoolVWstEthContractAddress?: Address;
  lstPoolComptrollerContractAddress?: Address;
  proposalExecutionGracePeriodMs?: number;
  blockTimeMs?: number;
  blocksPerDay?: number;
}

// TODO: import from @venusprotocol/tokens package once it's been created
export interface Token {
  symbol: string;
  decimals: number;
  asset: string;
  address: Address;
  isNative?: boolean;
  tokenWrapped?: Token;
}
