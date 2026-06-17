import { cn } from '@venusprotocol/ui';

import primeLogoSrc from 'assets/img/primeLogo.svg';
import { Icon } from 'components';
import { useTranslation } from 'libs/translations';

import { UserRewardsCard } from '../UserRewardsCard';
import { useGetPrimeUserRewards } from '../useGetPrimeUserRewards';

export interface UserRewardsSectionProps {
  className?: string;
}

export const UserRewardsSection: React.FC<UserRewardsSectionProps> = ({ className }) => {
  const { t } = useTranslation();
  const { isLoading, isPrime, totalRewardsCents, marketRewards } = useGetPrimeUserRewards();

  const hasRewards = totalRewardsCents > 0;

  let content: React.ReactNode;

  if (!hasRewards) {
    content = (
      <div className="flex items-center gap-x-3">
        {isPrime ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#805c4e]">
            <img
              src={primeLogoSrc}
              alt={t('primeLeaderboard.userRewards.primeLogoAlt')}
              className="h-5"
            />
          </span>
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-dark-blue-hover">
            <Icon name="person" className="text-light-grey" />
          </span>
        )}

        <p className={cn('flex-1 text-b1r', isPrime ? 'text-white' : 'text-yellow')}>
          {isPrime
            ? t('primeLeaderboard.userRewards.eligibleMessage')
            : t('primeLeaderboard.userRewards.notEligibleMessage')}
        </p>
      </div>
    );
  }

  return (
    <UserRewardsCard
      totalRewardsCents={totalRewardsCents}
      marketRewards={marketRewards}
      content={content}
      isLoading={isLoading}
      className={className}
    />
  );
};
