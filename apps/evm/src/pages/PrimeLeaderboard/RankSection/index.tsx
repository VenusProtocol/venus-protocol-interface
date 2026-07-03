import { useGetPrimeRank } from 'containers/PrimeRank/useGetPrimeRank';
import { useAccountAddress, useAuthModal } from 'libs/wallet';

import { RankCard } from '../RankCard';
import { useGetPrimeRankScore } from '../useGetPrimeRankScore';

export interface RankSectionProps {
  className?: string;
}

export const RankSection: React.FC<RankSectionProps> = ({ className }) => {
  const { accountAddress } = useAccountAddress();
  const { openAuthModal } = useAuthModal();
  const { isLoading, ...rankData } = useGetPrimeRank();
  const primeScore = useGetPrimeRankScore(rankData.primeScore);

  return (
    <RankCard
      isUserConnected={!!accountAddress}
      onConnect={() => openAuthModal({ analyticVariant: 'primeLeaderboardRankCard' })}
      rankData={{ ...rankData, primeScore }}
      isLoading={isLoading}
      className={className}
    />
  );
};
