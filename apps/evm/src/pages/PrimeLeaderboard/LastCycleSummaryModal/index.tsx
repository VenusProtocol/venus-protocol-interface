import { cn } from '@venusprotocol/ui';

import { Icon, Modal } from 'components';
import { useGetTokens } from 'libs/tokens';
import { useTranslation } from 'libs/translations';

import { PrimeRewardBadge } from '../PrimeRewardBadge';
import { TotalRewardsCard } from '../TotalRewardsCard';
import { UserRewardsCard } from '../UserRewardsCard';

// TODO: replace these placeholder values with the data returned by the API
const placeholderTotalRewardsCents = 46_230_000;
const placeholderTotalMarketRewardsCents = [28_040_000, 17_190_000];
const placeholderUserRewardsCents = 1_840_000;
const placeholderUserMarketRewardsCents = [1_140_000, 700_000];
const placeholderApyPercentage = 3.78;
const placeholderHasRewards = true;
const placeholderIsEligible = true;

export interface LastCycleSummaryModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const LastCycleSummaryModal: React.FC<LastCycleSummaryModalProps> = ({
  isOpen,
  handleClose,
}) => {
  const { t } = useTranslation();
  const tokens = useGetTokens();

  // TODO: replace these placeholder tokens with the real Prime markets returned by the API
  const markets = tokens.slice(0, placeholderTotalMarketRewardsCents.length);

  const totalMarketRewards = markets.map((token, index) => ({
    token,
    rewardsCents: placeholderTotalMarketRewardsCents[index],
  }));

  const userMarketRewards = markets.map((token, index) => ({
    token,
    rewardsCents: placeholderUserMarketRewardsCents[index],
    apyPercentage: placeholderApyPercentage,
  }));

  let userRewardsContent: React.ReactNode;

  if (!placeholderHasRewards) {
    userRewardsContent = (
      <div className="flex items-center gap-x-3">
        {placeholderIsEligible ? (
          <PrimeRewardBadge />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-dark-blue-hover">
            <Icon name="person" className="text-light-grey" />
          </span>
        )}

        <p
          className={cn(
            'flex-1 text-b1r',
            placeholderIsEligible ? 'text-light-grey' : 'text-yellow',
          )}
        >
          {placeholderIsEligible
            ? t('primeLeaderboard.lastCycleSummary.eligibleMessage')
            : t('primeLeaderboard.lastCycleSummary.notEligibleMessage')}
        </p>
      </div>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={t('primeLeaderboard.lastCycleSummary.title')}
      className="max-w-113"
    >
      <div className="flex flex-col gap-3">
        <TotalRewardsCard
          title={t('primeLeaderboard.lastCycleSummary.totalRewardsTitle')}
          totalRewardsCents={placeholderTotalRewardsCents}
          marketRewards={totalMarketRewards}
        />

        <UserRewardsCard
          title={t('primeLeaderboard.lastCycleSummary.userRewardsTitle')}
          totalRewardsCents={placeholderUserRewardsCents}
          marketRewards={userMarketRewards}
          content={userRewardsContent}
          showMarketActions={false}
        />
      </div>
    </Modal>
  );
};
