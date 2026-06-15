import { Button, ButtonWrapper, cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { Icon } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAuthModal } from 'libs/wallet';
import { shortenValueWithSuffix } from 'utilities';

import { LastCycleSummaryModal } from '../LastCycleSummaryModal';

// TODO: replace these placeholder values with the rank data returned by the API
const placeholderRank = 2;
const placeholderPrimeScore = 542_500_000;
const placeholderIsEligible = true;

export interface RankCardProps {
  className?: string;
}

export const RankCard: React.FC<RankCardProps> = ({ className }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const { openAuthModal } = useAuthModal();
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const cardClassName = cn('flex h-58 flex-col rounded-lg bg-background-active p-4', className);

  if (!accountAddress) {
    return (
      <div className={cn(cardClassName, 'items-center justify-between')}>
        <div className="flex flex-1 flex-col items-center justify-center gap-y-1">
          <span className="flex size-10 items-center justify-center rounded-lg bg-dark-blue-hover">
            <Icon name="barChart" className="size-5 text-light-grey" />
          </span>

          <p className="text-b1r text-light-grey">{t('primeLeaderboard.rankCard.connectPrompt')}</p>
        </div>

        <Button
          className="w-full"
          onClick={() => openAuthModal({ analyticVariant: 'primeLeaderboardRankCard' })}
        >
          {t('connectWallet.connectButton')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={cn(cardClassName, 'justify-between')}>
        <div>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-b1r text-light-grey">
                {t('primeLeaderboard.rankCard.rankLabel')}
              </span>
              <span className="text-h5 text-white">
                {placeholderIsEligible ? `#${placeholderRank}` : '#-'}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-b1r text-light-grey">
                {t('primeLeaderboard.rankCard.primeScoreLabel')}
              </span>
              <span className="text-h5 text-white">
                {placeholderIsEligible
                  ? shortenValueWithSuffix({ value: new BigNumber(placeholderPrimeScore) })
                  : '-'}
              </span>
            </div>
          </div>

          {placeholderIsEligible ? (
            <p className="mt-2 text-b1r text-green">{t('primeLeaderboard.rankCard.eligible')}</p>
          ) : (
            <div className="mt-2">
              <p className="text-b1r text-yellow">{t('primeLeaderboard.rankCard.notEligible')}</p>
              <p className="text-b1r text-white">{t('primeLeaderboard.rankCard.stakePrompt')}</p>
            </div>
          )}
        </div>

        <div className="flex gap-x-2.5">
          <ButtonWrapper asChild className="flex-1">
            <Link to={routes.vaults.path}>{t('primeLeaderboard.rankCard.stakeButton')}</Link>
          </ButtonWrapper>

          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setIsSummaryModalOpen(true)}
          >
            <div className="flex items-center gap-x-2">
              <Icon name="graduationCap" className="size-5" />
              {t('primeLeaderboard.rankCard.rulesButton')}
            </div>
          </Button>
        </div>
      </div>

      <LastCycleSummaryModal
        isOpen={isSummaryModalOpen}
        handleClose={() => setIsSummaryModalOpen(false)}
      />
    </>
  );
};
