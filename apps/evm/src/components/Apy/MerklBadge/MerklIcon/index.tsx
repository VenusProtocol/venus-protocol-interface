import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';
import merklLogoSrc from './merklLogo.svg';

export type MerklIconProps = Omit<React.HTMLAttributes<HTMLImageElement>, 'alt' | 'src'>;

export const MerklIcon: React.FC<MerklIconProps> = ({ className, ...otherProps }) => {
  const { t } = useTranslation();

  return (
    <img
      {...otherProps}
      src={merklLogoSrc}
      alt={t('apy.merklBadge.logoAlt')}
      className={cn('h-4', className)}
    />
  );
};
