import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';

import { Spinner } from 'components';
import { EligibilityStatus } from '../EligibilityStatus';
import { getRankLabels } from '../getRankLabels';
import { useGetPrimeRank } from '../useGetPrimeRank';

export interface FooterProps {
  hideLeaderboardLink?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ hideLeaderboardLink }) => {
  const { t, Trans } = useTranslation();

  const { accountAddress } = useAccountAddress();
  const rankData = useGetPrimeRank();
  const { hasStakedXvs, isCandidate, gapXvsTokens, isLoading } = rankData;

  const { rankLabel, primeScoreLabel } = accountAddress
    ? getRankLabels(rankData)
    : { rankLabel: '#—', primeScoreLabel: '—' };

  const leaderboardLink = !hideLeaderboardLink && (
    <span className="text-white">
      {' '}
      <Trans
        i18nKey="primeLeaderboard.rankFooter.learnMore"
        components={{
          LeaderboardLink: (
            <Link className="text-blue underline" to={routes.primeLeaderboard.path} />
          ),
        }}
      />
    </span>
  );

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-dark-blue-hover p-3">
      {accountAddress && isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-b1r text-light-grey">
                {t('primeLeaderboard.rankCard.rankLabel')}
              </span>

              <span className="text-p1s text-white">{rankLabel}</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-b1r text-light-grey">
                {t('primeLeaderboard.rankCard.primeScoreLabel')}
              </span>

              <span className="text-p1s text-white">{primeScoreLabel}</span>
            </div>
          </div>

          {accountAddress ? (
            <EligibilityStatus
              hasStakedXvs={hasStakedXvs}
              isCandidate={isCandidate}
              gapXvsTokens={gapXvsTokens}
              linkSlot={leaderboardLink}
            />
          ) : (
            <p className="text-b1r text-light-grey">
              {t('primeLeaderboard.rankFooter.connectPrompt')}
              {leaderboardLink}
            </p>
          )}
        </>
      )}
    </div>
  );
};
