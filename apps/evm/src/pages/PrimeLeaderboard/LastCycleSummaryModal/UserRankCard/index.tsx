import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { useGetPrimeRankLimit } from 'containers/PrimeRank/useGetPrimeRankLimit';
import { useTranslation } from 'libs/translations';
import { shortenValueWithSuffix } from 'utilities';

export interface UserRankCardProps {
  rank?: number;
  primeScore?: BigNumber;
  className?: string;
}

export const UserRankCard: React.FC<UserRankCardProps> = ({ rank, primeScore, className }) => {
  const { t } = useTranslation();
  const rankLimit = useGetPrimeRankLimit();

  const isRanked = rank !== undefined;
  const isInTopRank = isRanked && rankLimit !== undefined && rank <= rankLimit;
  const rankLabel = isRanked ? `#${rank}` : '#-';
  const primeScoreLabel =
    isRanked && primeScore ? shortenValueWithSuffix({ value: primeScore }) : '-';

  let message = t('primeLeaderboard.lastCycleSummary.rankNoStake');
  let messageClassName = 'text-yellow';

  if (isInTopRank) {
    message = t('primeLeaderboard.lastCycleSummary.rankQualified', { limit: rankLimit });
    messageClassName = 'text-white';
  } else if (isRanked) {
    message = t('primeLeaderboard.lastCycleSummary.rankMissed', { limit: rankLimit });
  }

  return (
    <div className={cn('flex flex-col gap-4 rounded-lg bg-background-active p-4', className)}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-b1r text-light-grey">
            {t('primeLeaderboard.lastCycleSummary.rankLabel')}
          </span>

          <span className="text-h5 text-white">{rankLabel}</span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-b1r text-light-grey">
            {t('primeLeaderboard.lastCycleSummary.primeScoreLabel')}
          </span>

          <span className="text-h5 text-white">{primeScoreLabel}</span>
        </div>
      </div>

      <p className={cn('text-b1r', messageClassName)}>{message}</p>
    </div>
  );
};
