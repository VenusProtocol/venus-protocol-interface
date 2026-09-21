import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';
import campaignLogoSrc from './campaignLogo.svg';

export type CampaignIconProps = Omit<React.HTMLAttributes<HTMLImageElement>, 'alt' | 'src'>;

export const CampaignIcon: React.FC<CampaignIconProps> = ({ className, ...otherProps }) => {
  const { t } = useTranslation();

  return (
    <img
      {...otherProps}
      src={campaignLogoSrc}
      alt={t('apy.merklBadge.logoAlt')}
      className={cn('h-4', className)}
    />
  );
};
