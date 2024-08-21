import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';

export const featureFlags = {
  integratedSwap: [ChainId.BSC_TESTNET, ChainId.BSC_MAINNET],
  prime: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.SEPOLIA,
    ChainId.ETHEREUM,
    ChainId.ARBITRUM_SEPOLIA,
    ChainId.ARBITRUM_ONE,
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
  convertVrtRoute: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  vaiRoute: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  swapRoute: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  xvsRoute: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  createProposal: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  voteProposal: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  apyCharts: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.OPBNB_MAINNET,
    ChainId.OPBNB_TESTNET,
    ChainId.ARBITRUM_ONE,
  ],
  marketParticipantCounts: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.OPBNB_MAINNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.ARBITRUM_ONE,
    ChainId.ARBITRUM_SEPOLIA,
  ],
  isolatedPools: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET, ChainId.ETHEREUM, ChainId.SEPOLIA],
  bridgeRoute: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.OPBNB_MAINNET,
    ChainId.OPBNB_TESTNET,
    ChainId.ARBITRUM_SEPOLIA,
    ChainId.ARBITRUM_ONE,
  ],
  wrapUnwrapNativeToken: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.OPBNB_MAINNET,
    ChainId.OPBNB_TESTNET,
    ChainId.ARBITRUM_SEPOLIA,
    ChainId.ARBITRUM_ONE,
  ],
  governanceSearch: [
    ChainId.BSC_TESTNET,
    ChainId.BSC_MAINNET,
    ChainId.SEPOLIA,
    ChainId.ETHEREUM,
    ChainId.OPBNB_TESTNET,
    ChainId.OPBNB_MAINNET,
    ChainId.ARBITRUM_SEPOLIA,
    ChainId.ARBITRUM_ONE,
  ],
  multichainGovernance: [
    ChainId.BSC_TESTNET,
    ChainId.SEPOLIA,
    ChainId.OPBNB_TESTNET,
    ChainId.ARBITRUM_SEPOLIA,
  ],
};

export type FeatureFlag = keyof typeof featureFlags;

export interface UseIsFeatureEnabled {
  name: FeatureFlag;
}

export const useIsFeatureEnabled = ({ name }: UseIsFeatureEnabled) => {
  const { chainId } = useChainId();
  return featureFlags[name].includes(chainId);
};
