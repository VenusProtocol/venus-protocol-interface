import { getUnixTime } from 'date-fns/getUnixTime';

export const isDistributingRewards = ({
  isTimeBased,
  lastRewardingTimestamp,
  lastRewardingBlock,
  currentBlockNumber,
}: {
  isTimeBased: boolean;
  lastRewardingTimestamp?: number;
  lastRewardingBlock?: number;
  currentBlockNumber: bigint;
}): boolean => {
  const nowTimestamp = getUnixTime(new Date());

  if (isTimeBased && typeof lastRewardingTimestamp === 'number') {
    return lastRewardingTimestamp === 0 || lastRewardingTimestamp >= nowTimestamp;
  }

  if (!isTimeBased && typeof lastRewardingBlock === 'number') {
    return lastRewardingBlock === 0 || lastRewardingBlock >= currentBlockNumber;
  }

  return false;
};
