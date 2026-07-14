import { TotalRewardsCard } from '../TotalRewardsCard';
import { useGetPrimeTotalRewards } from '../useGetPrimeTotalRewards';

export interface TotalRewardsSectionProps {
  className?: string;
}

export const TotalRewardsSection: React.FC<TotalRewardsSectionProps> = ({ className }) => {
  const { isLoading, totalRewardsCents, totalEstimatedRewardsCents, marketRewards } =
    useGetPrimeTotalRewards();

  return (
    <TotalRewardsCard
      totalRewardsCents={totalRewardsCents}
      totalEstimatedRewardsCents={totalEstimatedRewardsCents}
      marketRewards={marketRewards}
      isLoading={isLoading}
      className={className}
    />
  );
};
