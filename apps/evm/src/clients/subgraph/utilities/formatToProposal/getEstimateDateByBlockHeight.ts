import type { Chain } from '@venusprotocol/chains';

export const getEstimateDateByBlockHeight = (
  targetBlockHeight: number,
  currentBlockHeight: number,
  blockTimes: NonNullable<Chain['blockTimes']>,
) => {
  const blockTimesWithIndex = blockTimes.map((item, index) => ({
    ...item,
    index,
  }));

  const getBlockTimeByTimestamp = (timestamp: number) => {
    let targetBlockTime: (typeof blockTimes)[number] | undefined;

    blockTimesWithIndex.forEach(item => {
      if (timestamp > item.startTimestamp) {
        targetBlockTime = item;
      }
    });
    return targetBlockTime as (typeof blockTimes)[number] & { index: number };
  };

  const now = new Date().getTime();
  const totalBlockDiff = currentBlockHeight - targetBlockHeight; // negative: target is in the future
  const nowBlockTime = getBlockTimeByTimestamp(now);

  // Try to calculate target time using block time for now.
  const estimateTargetTime = now - nowBlockTime.blockTimeMs * totalBlockDiff;
  const estimateBlockTime = getBlockTimeByTimestamp(estimateTargetTime);

  // When target time falls in the same block time as now, no further calcuation required
  if (estimateBlockTime.blockTimeMs === nowBlockTime.blockTimeMs) {
    return new Date(estimateTargetTime);
  }

  // When target is earlier than now, remove the blockTimes after now and reverse; otherwise, remove the blockTimes before now.
  const amendedBlockTimes =
    totalBlockDiff > 0
      ? blockTimesWithIndex.filter(item => item.index <= nowBlockTime.index).reverse()
      : blockTimesWithIndex.filter(item => item.index >= nowBlockTime.index);

  let ret: number;

  if (totalBlockDiff > 0) {
    const { timestamp } = amendedBlockTimes.reduce(
      (accu, curr) => {
        if (accu.remainingBlockCount <= 0) return accu;

        const blockDiff = (accu.timestamp - curr.startTimestamp) / curr.blockTimeMs;
        const remainingBlockCount = accu.remainingBlockCount - blockDiff;

        if (remainingBlockCount <= 0) {
          return {
            timestamp: accu.timestamp - accu.remainingBlockCount * curr.blockTimeMs,
            remainingBlockCount,
          };
        }

        // need to go further blockTime
        return {
          timestamp: curr.startTimestamp,
          remainingBlockCount,
        };
      },
      {
        timestamp: now,
        remainingBlockCount: totalBlockDiff,
      },
    );

    ret = timestamp;
  } else {
    const { timestamp } = amendedBlockTimes.reduce(
      (accu, curr, index) => {
        if (accu.remainingBlockCount >= 0 || index === 0) return accu;

        const remainingBlockCount =
          accu.remainingBlockCount - (accu.timestamp - curr.startTimestamp) / accu.prevBlockTimeMs;

        // When target falls into the current range.
        if (remainingBlockCount >= 0) {
          return {
            timestamp: accu.timestamp - accu.remainingBlockCount * accu.prevBlockTimeMs,
            remainingBlockCount,
            prevBlockTimeMs: curr.blockTimeMs,
          };
        }

        return {
          timestamp:
            curr.startTimestamp -
            (index === amendedBlockTimes.length - 1 && remainingBlockCount < 0
              ? remainingBlockCount * curr.blockTimeMs
              : 0),
          remainingBlockCount,
          prevBlockTimeMs: curr.blockTimeMs,
        };
      },
      {
        remainingBlockCount: totalBlockDiff,
        timestamp: now,
        prevBlockTimeMs: amendedBlockTimes[0].blockTimeMs,
      },
    );

    ret = timestamp;
  }

  return ret > 0 ? new Date(ret) : undefined;
};
