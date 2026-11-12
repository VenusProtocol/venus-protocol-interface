import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import { useTranslation } from 'libs/translations';

import { useGetPrimeRankLimit } from '../useGetPrimeRankLimit';

// Maximum XVS gap to the top #500 for which the exact amount left to stake is shown
const TOP_500_GAP_THRESHOLD_XVS_TOKENS = 100_000;

export interface EligibilityStatusProps {
  hasStakedXvs: boolean;
  isCandidate: boolean;
  gapXvsTokens: number;
  hideStakeGap?: boolean;
  // Optional inline content appended to the end of the status message (e.g. a leaderboard link)
  linkSlot?: React.ReactNode;
  className?: string;
}

export const EligibilityStatus: React.FC<EligibilityStatusProps> = ({
  hasStakedXvs,
  isCandidate,
  gapXvsTokens,
  hideStakeGap = false,
  linkSlot,
  className,
}) => {
  const { t, Trans } = useTranslation();
  const rankLimit = useGetPrimeRankLimit();

  const isEligible = hasStakedXvs && isCandidate;

  if (isEligible) {
    return (
      <p className={cn('text-b1r text-success', className)}>
        {t('primeLeaderboard.rankCard.eligible')}
        {linkSlot}
      </p>
    );
  }

  const isWithinReach =
    !hideStakeGap &&
    hasStakedXvs &&
    gapXvsTokens > 0 &&
    gapXvsTokens <= TOP_500_GAP_THRESHOLD_XVS_TOKENS;

  let stakeMessage: React.ReactNode = t('primeLeaderboard.rankCard.stakePrompt');

  if (isWithinReach) {
    stakeMessage = (
      <Trans
        i18nKey="primeLeaderboard.rankCard.stakeToReachTop"
        values={{ amount: new BigNumber(gapXvsTokens).toFormat(2), limit: rankLimit }}
        components={{ Highlight: <span className="text-b1s text-primary" /> }}
      />
    );
  } else if (!hideStakeGap && hasStakedXvs && gapXvsTokens > TOP_500_GAP_THRESHOLD_XVS_TOKENS) {
    stakeMessage = t('primeLeaderboard.rankCard.stakeMore');
  } else if (hasStakedXvs) {
    stakeMessage = t('primeLeaderboard.rankCard.stakeMoreToCompete');
  }

  return (
    <div className={className}>
      <p className="text-b1r text-warning">{t('primeLeaderboard.rankCard.notEligible')}</p>
      <p className="text-b1r text-primary">
        {stakeMessage}
        {linkSlot}
      </p>
    </div>
  );
};
