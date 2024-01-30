import { useChainId } from 'packages/wallet';
import { ChainId } from 'types';

const featureFlags = {
  integratedSwap: [ChainId.BSC_TESTNET, ChainId.BSC_MAINNET],
  prime: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET, ChainId.SEPOLIA],
  primeCalculator: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET, ChainId.SEPOLIA],
  tusdMigrationWarning: [ChainId.BSC_MAINNET],
  trxMigrationWarning: [ChainId.BSC_MAINNET],
  sxpDisablingWarning: [ChainId.BSC_MAINNET],
  bethUpdateWarning: [ChainId.BSC_MAINNET],
  convertVrtRoute: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  historyRoute: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  vaiRoute: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  swapRoute: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  xvsRoute: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  createProposal: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  voteProposal: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  lunaUstWarning: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  marketHistory: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  marketParticipantCounts: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
  ],
  vaiMintPrimeOnlyWarning: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET],
  isolatedPools: [ChainId.BSC_MAINNET, ChainId.BSC_TESTNET, ChainId.ETHEREUM, ChainId.SEPOLIA],
  bridgeRoute: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.OPBNB_TESTNET,
  ],
  chainSelect: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.OPBNB_TESTNET,
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
