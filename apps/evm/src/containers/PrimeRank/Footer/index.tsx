import BigNumber from 'bignumber.js';

import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { shortenValueWithSuffix } from 'utilities';

import { EligibilityStatus } from '../EligibilityStatus';
import { useGetPrimeRank } from '../useGetPrimeRank';

export interface FooterProps {
  hideLeaderboardLink?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ hideLeaderboardLink }) => {
  const { t, Trans } = useTranslation();

  const { hasStakedXvs, isCandidate, isPrime, hasSupplied, rank, primeScore, gapXvsTokens } =
    useGetPrimeRank();

  const rankLabel = hasStakedXvs ? `#${rank}` : '#-';
  const primeScoreLabel = hasStakedXvs
    ? shortenValueWithSuffix({ value: new BigNumber(primeScore) })
    : '-';

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-dark-blue-hover p-3">
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

      <EligibilityStatus
        hasStakedXvs={hasStakedXvs}
        isCandidate={isCandidate}
        isPrime={isPrime}
        hasSupplied={hasSupplied}
        gapXvsTokens={gapXvsTokens}
        linkSlot={
          !hideLeaderboardLink && (
            <span className="text-white">
              {' '}
              <Trans
                i18nKey="primeLeaderboard.rankFooter.learnMore"
                components={{
                  leaderboardLink: (
                    <Link className="text-blue underline" to={routes.primeLeaderboard.path} />
                  ),
                }}
              />
            </span>
          )
        }
      />
    </div>
  );
};
