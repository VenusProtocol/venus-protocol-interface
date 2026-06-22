import { ProgressBar, TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatCentsToReadableValue } from 'utilities';

export interface MarketRewardRowProps {
  token: Token;
  rewardsCents: number;
  totalRewardsCents: number;
  children?: React.ReactNode;
}

export const MarketRewardRow: React.FC<MarketRewardRowProps> = ({
  token,
  rewardsCents,
  totalRewardsCents,
  children,
}) => {
  const { t } = useTranslation();

  const progressPercentage =
    totalRewardsCents > 0 ? Math.min(100, (rewardsCents / totalRewardsCents) * 100) : 0;

  return (
    <div className="flex items-center">
      <TokenIconWithSymbol token={token} className="shrink-0 text-b1s text-white" />

      <span className="ml-auto text-p3r text-white">
        {formatCentsToReadableValue({ value: rewardsCents })}
      </span>

      <div className="ml-1 w-1/4 shrink-0">
        <ProgressBar
          min={0}
          max={100}
          value={progressPercentage}
          step={1}
          ariaLabel={t('primeLeaderboard.userRewards.rewardShareAriaLabel')}
        />
      </div>

      {children}
    </div>
  );
};
