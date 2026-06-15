import { useAccountAddress, useAuthModal } from 'libs/wallet';

import { RankCard } from '../RankCard';
import { useGetPrimeRank } from '../useGetPrimeRank';

export interface RankSectionProps {
  className?: string;
}

export const RankSection: React.FC<RankSectionProps> = ({ className }) => {
  const { accountAddress } = useAccountAddress();
  const { openAuthModal } = useAuthModal();
  const rankData = useGetPrimeRank();

  return (
    <RankCard
      isUserConnected={!!accountAddress}
      onConnect={() => openAuthModal({ analyticVariant: 'primeLeaderboardRankCard' })}
      rankData={rankData}
      className={className}
    />
  );
};
