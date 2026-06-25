import BigNumber from 'bignumber.js';

import { Modal } from 'components';
import { useGetTokens } from 'libs/tokens';
import { useTranslation } from 'libs/translations';

import { UserRewardsCard } from '../UserRewardsCard';
import { UserRankCard } from './UserRankCard';

// TODO: replace these placeholder values with the data returned by the API
const placeholderRank = 1222;
const placeholderPrimeScore = new BigNumber(542_500_000);
const placeholderUserRewardsCents = 1_840_000;
const placeholderUserMarketRewardsCents = [1_140_000, 700_000];
const placeholderApyPercentage = 3.78;

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
  const markets = tokens.slice(0, placeholderUserMarketRewardsCents.length);

  const userMarketRewards = markets.map((token, index) => ({
    token,
    rewardsCents: placeholderUserMarketRewardsCents[index],
    apyPercentage: placeholderApyPercentage,
  }));

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={t('primeLeaderboard.lastCycleSummary.title')}
      className="max-w-113"
    >
      <div className="flex flex-col gap-3">
        <UserRankCard rank={placeholderRank} primeScore={placeholderPrimeScore} />

        <UserRewardsCard
          title={t('primeLeaderboard.lastCycleSummary.userRewardsTitle')}
          totalRewardsCents={placeholderUserRewardsCents}
          marketRewards={userMarketRewards}
          showMarketActions={false}
        />
      </div>
    </Modal>
  );
};
