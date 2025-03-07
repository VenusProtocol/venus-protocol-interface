import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';
import primeLogoSrc from './primeLogo.svg';

export type PrimeIconProps = Omit<React.HTMLAttributes<HTMLImageElement>, 'alt' | 'src'>;

export const PrimeIcon: React.FC<PrimeIconProps> = ({ className, ...otherProps }) => {
  const { t } = useTranslation();

  return (
    <img
      {...otherProps}
      src={primeLogoSrc}
      alt={t('apy.primeBadge.logoAlt')}
      className={cn('h-4', className)}
    />
  );
};
