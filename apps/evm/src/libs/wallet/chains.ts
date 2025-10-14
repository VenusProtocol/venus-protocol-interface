import { ChainId, MainnetChainId, TestnetChainId, viemChainMapping } from '@venusprotocol/chains';
import type { Chain } from 'viem';

import localConfig from 'config';
import { extractEnumValues } from 'utilities/extractEnumValues';

const getSupportedChains = () => {
  const chainIds =
    localConfig.network === 'testnet'
      ? extractEnumValues(TestnetChainId)
      : extractEnumValues(MainnetChainId);

  const chains: Chain[] = chainIds.map(chainId => viemChainMapping[chainId]);

  return chains;
};

export const governanceChain =
  viemChainMapping[localConfig.network === 'testnet' ? ChainId.BSC_TESTNET : ChainId.BSC_MAINNET];

export const chains = getSupportedChains();

export const defaultChain = chains[0];
