import { useGetPrimeRank } from 'containers/PrimeRank/useGetPrimeRank';
import { useAccountAddress, useAuthModal } from 'libs/wallet';

import { RankCard } from '../RankCard';

export interface RankSectionProps {
  className?: string;
}

export const RankSection: React.FC<RankSectionProps> = ({ className }) => {
  const { accountAddress } = useAccountAddress();
  const { openAuthModal } = useAuthModal();
  const { isLoading, ...rankData } = useGetPrimeRank();

  return (
    <RankCard
      isUserConnected={!!accountAddress}
      onConnect={() => openAuthModal({ analyticVariant: 'primeLeaderboardRankCard' })}
      rankData={rankData}
      isLoading={isLoading}
      className={className}
    />
  );
};
