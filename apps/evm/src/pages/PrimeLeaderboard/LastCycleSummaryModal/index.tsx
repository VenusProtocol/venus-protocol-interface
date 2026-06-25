import { Modal } from 'components';
import { useTranslation } from 'libs/translations';

import { UserRewardsCard } from '../UserRewardsCard';
import { UserRankCard } from './UserRankCard';
import { useGetPrimeLastCycleSummary } from './useGetPrimeLastCycleSummary';

export interface LastCycleSummaryModalProps {
  cycleIndex?: number;
  isOpen: boolean;
  handleClose: () => void;
}

export const LastCycleSummaryModal: React.FC<LastCycleSummaryModalProps> = ({
  cycleIndex,
  isOpen,
  handleClose,
}) => {
  const { t } = useTranslation();
  const { rank, primeScore, totalRewardsCents, marketRewards } =
    useGetPrimeLastCycleSummary(cycleIndex);

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={t('primeLeaderboard.lastCycleSummary.title')}
      className="max-w-113"
    >
      <div className="flex flex-col gap-3">
        <UserRankCard rank={rank} primeScore={primeScore} />

        <UserRewardsCard
          title={t('primeLeaderboard.lastCycleSummary.userRewardsTitle')}
          totalRewardsCents={totalRewardsCents}
          marketRewards={marketRewards}
          showMarketActions={false}
        />
      </div>
    </Modal>
  );
};
