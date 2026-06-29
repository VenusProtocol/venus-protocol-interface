import BigNumber from 'bignumber.js';

import type { PrimeDeposit, PrimeMultiplierTier } from 'clients/api';

const EXP_SCALE = new BigNumber('1e18');

export interface CalculateStakeToReachTopInput {
  userDeposits: PrimeDeposit[];
  targetDeposits: PrimeDeposit[];
  tiers: PrimeMultiplierTier[];
  cycleEndsAt: Date;
  now: Date;
}

export const calculateStakeToReachTop = ({
  userDeposits,
  targetDeposits,
  tiers,
  cycleEndsAt,
  now,
}: CalculateStakeToReachTopInput): number => {
  if (tiers.length === 0) {
    return 0;
  }

  const capSeconds = tiers[tiers.length - 1].durationSeconds;
  const endSeconds = Math.floor(cycleEndsAt.getTime() / 1000);
  const remainingSeconds = endSeconds - Math.floor(now.getTime() / 1000);

  if (remainingSeconds <= 0) {
    return 0;
  }

  const getMultiplierMantissa = (holdSeconds: number) => {
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (holdSeconds >= tiers[i].durationSeconds) {
        return tiers[i].multiplierMantissa;
      }
    }

    return EXP_SCALE;
  };

  const getScore = (amountMantissa: BigNumber, holdSeconds: number) => {
    if (holdSeconds <= 0) {
      return new BigNumber(0);
    }

    const cappedSeconds = Math.min(holdSeconds, capSeconds);
    return amountMantissa
      .times(getMultiplierMantissa(holdSeconds))
      .times(cappedSeconds)
      .div(EXP_SCALE);
  };

  const getFinalScore = (deposits: PrimeDeposit[]) =>
    deposits.reduce(
      (total, deposit) =>
        total.plus(getScore(deposit.amountMantissa, endSeconds - deposit.timestampSeconds)),
      new BigNumber(0),
    );

  const scoreGap = getFinalScore(targetDeposits).minus(getFinalScore(userDeposits));

  if (scoreGap.isLessThanOrEqualTo(0)) {
    return 0;
  }

  const scorePerStakedXvs = getScore(EXP_SCALE, remainingSeconds);

  if (scorePerStakedXvs.isLessThanOrEqualTo(0)) {
    return 0;
  }

  return scoreGap.div(scorePerStakedXvs).integerValue(BigNumber.ROUND_CEIL).toNumber();
};
