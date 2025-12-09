import type { BlockTime } from '@venusprotocol/chains';

const getBlockTimeByTimestamp = ({
  timestamp,
  blockTimes = [],
}: { timestamp: number; blockTimes: BlockTime[] }) => {
  let targetBlockTime = blockTimes[0];

  blockTimes.forEach(item => {
    if (timestamp > item.startTimestamp) {
      targetBlockTime = item;
    }
  });
  return targetBlockTime;
};

export const getEstimatedDateByBlockHeight = ({
  targetBlockHeight,
  currentBlockHeight,
  blockTimes = [],
}: {
  targetBlockHeight: number;
  currentBlockHeight: number;
  blockTimes: BlockTime[];
}) => {
  const now = new Date().getTime();
  const totalBlockDiff = currentBlockHeight - targetBlockHeight; // negative: target is in the future
  const nowBlockTime = getBlockTimeByTimestamp({ timestamp: now, blockTimes });

  // Try to calculate target time using block time for now.
  const estimatedTargetTime = now - nowBlockTime.blockTimeMs * totalBlockDiff;
  const estimatedBlockTime = getBlockTimeByTimestamp({
    timestamp: estimatedTargetTime,
    blockTimes,
  });

  // When target time falls in the same block time as now, no further calcuation required
  if (estimatedBlockTime.blockTimeMs === nowBlockTime.blockTimeMs) {
    return new Date(estimatedTargetTime);
  }

  // When target is earlier than now, remove the blockTimes after now and reverse; otherwise, remove the blockTimes before now.
  const amendedBlockTimes =
    totalBlockDiff > 0
      ? blockTimes.filter(item => item.startTimestamp <= nowBlockTime.startTimestamp).reverse()
      : blockTimes.filter(item => item.startTimestamp >= nowBlockTime.startTimestamp);

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

        // need to traverse more block times
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
