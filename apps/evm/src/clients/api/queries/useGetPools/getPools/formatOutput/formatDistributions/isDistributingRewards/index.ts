import { getUnixTime } from 'date-fns/getUnixTime';

export const isDistributingRewards = ({
  isTimeBasedOrMerklReward,
  lastRewardingTimestamp,
  lastRewardingBlock,
  currentBlockNumber,
}: {
  isTimeBasedOrMerklReward: boolean;
  lastRewardingTimestamp?: number;
  lastRewardingBlock?: number;
  currentBlockNumber: bigint;
}): boolean => {
  if (isTimeBasedOrMerklReward && typeof lastRewardingTimestamp === 'number') {
    const nowTimestamp = getUnixTime(new Date());
    return lastRewardingTimestamp === 0 || lastRewardingTimestamp >= nowTimestamp;
  }

  if (!isTimeBasedOrMerklReward && typeof lastRewardingBlock === 'number') {
    return lastRewardingBlock === 0 || lastRewardingBlock >= currentBlockNumber;
  }

  return false;
};
