import { cn } from '@venusprotocol/ui';

import { useTranslation } from 'libs/translations';

import firstPlaceSrc from './firstPlace.svg';
import secondPlaceSrc from './secondPlace.svg';
import thirdPlaceSrc from './thirdPlace.svg';

const badgeSrcs: Record<number, string> = {
  1: firstPlaceSrc,
  2: secondPlaceSrc,
  3: thirdPlaceSrc,
};

export interface RankBadgeProps {
  rank: number;
  className?: string;
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, className }) => {
  const { t } = useTranslation();

  const src = badgeSrcs[rank];

  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={t('primeLeaderboard.rankTable.rankBadgeAlt', { rank })}
      className={cn('size-5 shrink-0', className)}
    />
  );
};
