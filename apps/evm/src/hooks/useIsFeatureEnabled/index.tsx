import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';

export const featureFlags = {
  integratedSwap: [ChainId.BSC_MAINNET],
  prime: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.SEPOLIA,
    ChainId.ETHEREUM,
    ChainId.ARBITRUM_SEPOLIA,
    ChainId.ARBITRUM_ONE,
    ChainId.ZKSYNC_SEPOLIA,
    ChainId.ZKSYNC_MAINNET,
  ],
  primeCalculator: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.ARBITRUM_SEPOLIA,
  ],
  tusdMigrationWarning: [ChainId.BSC_MAINNET],
  trxMigrationWarning: [ChainId.BSC_MAINNET],
  sxpDisablingWarning: [ChainId.BSC_MAINNET],
  bethUpdateWarning: [ChainId.BSC_MAINNET],
  vaiRoute: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  swapRoute: [ChainId.BSC_TESTNET],
  createProposal: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  voteProposal: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  apyCharts: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.ARBITRUM_ONE,
    ChainId.ZKSYNC_SEPOLIA,
    ChainId.ZKSYNC_MAINNET,
    ChainId.BASE_MAINNET,
    ChainId.BASE_SEPOLIA,
  ],
  marketParticipantCounts: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.ARBITRUM_ONE,
    ChainId.ARBITRUM_SEPOLIA,
    ChainId.ZKSYNC_SEPOLIA,
    ChainId.ZKSYNC_MAINNET,
    ChainId.BASE_MAINNET,
    ChainId.BASE_SEPOLIA,
  ],
  bridgeRoute: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.ARBITRUM_SEPOLIA,
    ChainId.ARBITRUM_ONE,
    ChainId.ZKSYNC_SEPOLIA,
    ChainId.ZKSYNC_MAINNET,
    ChainId.BASE_MAINNET,
    ChainId.BASE_SEPOLIA,
  ],
  wrapUnwrapNativeToken: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.ARBITRUM_SEPOLIA,
    ChainId.ARBITRUM_ONE,
    ChainId.ZKSYNC_SEPOLIA,
    ChainId.ZKSYNC_MAINNET,
    ChainId.BASE_MAINNET,
    ChainId.BASE_SEPOLIA,
  ],
  gaslessTransactions: [] as ChainId[],
  web3DomainNames: [ChainId.BSC_MAINNET, ChainId.ETHEREUM, ChainId.ARBITRUM_ONE],
  burnedWBnbButton: [ChainId.BSC_MAINNET],
  importPositions: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.BASE_MAINNET,
    ChainId.BASE_SEPOLIA,
  ],
  importAavePositions: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ARBITRUM_ONE,
    ChainId.ARBITRUM_SEPOLIA,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.ZKSYNC_MAINNET,
    ChainId.ZKSYNC_SEPOLIA,
    ChainId.BASE_MAINNET,
    ChainId.BASE_SEPOLIA,
  ],
  eMode: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.SEPOLIA,
    ChainId.ARBITRUM_SEPOLIA,
    ChainId.ZKSYNC_SEPOLIA,
    ChainId.BASE_SEPOLIA,
  ],
  transactionHistory: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  leveragedPositions: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  repayWithCollateral: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  statsRoute: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  trade: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  primeLeaderboard: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  liquidityHub: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  liquidityHubAutoResupply: [ChainId.BSC_TESTNET],
  spoke: [ChainId.BSC_TESTNET],
};

export type FeatureFlag = keyof typeof featureFlags;

export interface UseIsFeatureEnabledInput {
  name: FeatureFlag;
}

export const useIsFeatureEnabled = ({ name }: UseIsFeatureEnabledInput) => {
  const { chainId } = useChainId();
  return featureFlags[name].includes(chainId);
};
