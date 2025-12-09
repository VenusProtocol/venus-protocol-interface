import { chains } from '../../chains/chainMetadata';
import { MS_PER_DAY } from '../../constants';
import type { ChainId } from '../../types';

export const getBlockTimeByChainId = ({
  chainId,
  targetTimestamp = new Date().getTime(),
}: { chainId: ChainId; targetTimestamp?: number }) => {
  const targetChain = chains[chainId];
  if (!Array.isArray(targetChain.blockTimes)) return undefined;

  // default to first item
  let blockTime = targetChain.blockTimes[0];

  // Find the right blockTime based on targetTimestamp
  if (targetChain.blockTimes.length > 1) {
    targetChain.blockTimes.forEach(item => {
      if (item.startTimestamp <= targetTimestamp) {
        blockTime = item;
      }
    });
  }

  const { blockTimeMs, startTimestamp } = blockTime;

  return {
    startTimestamp,
    blockTimeMs,
    blocksPerDay: blockTime.blockTimeMs !== 0 ? MS_PER_DAY / blockTime.blockTimeMs : 0,
  };
};
