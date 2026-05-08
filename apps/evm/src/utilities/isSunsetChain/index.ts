import { SUNSET_CHAIN_IDS } from 'constants/sunsetChains';
import type { ChainId } from 'types';

export const isSunsetChain = (chainId: ChainId) => SUNSET_CHAIN_IDS.includes(chainId);
