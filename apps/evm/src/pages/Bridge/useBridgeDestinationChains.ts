import type { Chain } from 'viem';

import { useGetXvsBridgeDestinationLimits } from 'clients/api';
import type { ChainId } from 'types';
import { bridgeChains } from './constants';

interface UseBridgeDestinationChainsInput {
  fromChainId: ChainId;
}

interface UseBridgeDestinationChainsOutput {
  destinationChains: Chain[];
  areLimitsKnown: boolean;
}

// The chains the bridge is enabled on are statically configured, but a lane can be closed on-chain:
// the OFT reverts every send whose destination has a single transaction limit of 0. This narrows the
// configured destinations down to the lanes that are actually open, so closed ones are never offered
const useBridgeDestinationChains = ({
  fromChainId,
}: UseBridgeDestinationChainsInput): UseBridgeDestinationChainsOutput => {
  const candidateChains = bridgeChains.filter(chain => chain.id !== fromChainId);

  const { data: getXvsBridgeDestinationLimitsData } = useGetXvsBridgeDestinationLimits({
    toChainIds: candidateChains.map(chain => chain.id as ChainId),
  });

  // until the on-chain limits are known, keep every configured destination: narrowing the list on
  // missing data would leave the form without a destination on a temporary RPC failure
  if (!getXvsBridgeDestinationLimitsData) {
    return { destinationChains: candidateChains, areLimitsKnown: false };
  }

  const { maxSingleTransactionLimitMantissas } = getXvsBridgeDestinationLimitsData;
  const openChains = candidateChains.filter(chain =>
    maxSingleTransactionLimitMantissas[chain.id as ChainId]?.isGreaterThan(0),
  );

  // if no lane out of this chain is open, keep the full list rather than rendering a select with no
  // selected option: the amount field already blocks the transfer with the exact on-chain limit
  if (openChains.length === 0) {
    return { destinationChains: candidateChains, areLimitsKnown: false };
  }

  return { destinationChains: openChains, areLimitsKnown: true };
};

export default useBridgeDestinationChains;
