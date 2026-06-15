import { UserRewardsCard } from '../UserRewardsCard';
import { useGetPrimeUserRewards } from '../useGetPrimeUserRewards';

export interface UserRewardsSectionProps {
  className?: string;
}

export const UserRewardsSection: React.FC<UserRewardsSectionProps> = ({ className }) => {
  const { totalRewardsCents, marketRewards } = useGetPrimeUserRewards();

  return (
    <UserRewardsCard
      totalRewardsCents={totalRewardsCents}
      marketRewards={marketRewards}
      className={className}
    />
  );
};
