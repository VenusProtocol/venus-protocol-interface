import { cn } from '@venusprotocol/ui';

import primeLogoSrc from 'assets/img/primeLogo.svg';

export interface PrimeRewardBadgeProps {
  className?: string;
}

export const PrimeRewardBadge: React.FC<PrimeRewardBadgeProps> = ({ className }) => (
  <span
    className={cn(
      'flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#805c4e]',
      className,
    )}
  >
    <img src={primeLogoSrc} alt="" className="h-5" />
  </span>
);
