import { cn } from '@venusprotocol/ui';

import { Icon, Tooltip } from 'components';
import { useTranslation } from 'libs/translations';

export interface IsolatedEModeGroupTooltipProps {
  eModeGroupName: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const IsolatedEModeGroupTooltip: React.FC<IsolatedEModeGroupTooltipProps> = ({
  eModeGroupName,
  variant = 'primary',
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Tooltip
      className={cn(
        'rounded-full inline-flex items-center gap-1 pl-2 pr-1 cursor-pointer',
        variant === 'primary' ? 'text-yellow bg-yellow/[.07]' : 'text-offWhite bg-offWhite/15',
        className,
      )}
      content={t('markets.isolatedEModeGroupTooltip.content', {
        eModeGroupName,
      })}
    >
      <span className="text-xs font-medium leading-[21px]">
        {t('markets.isolatedEModeGroupTooltip.label')}
      </span>

      <Icon name="info" className="text-inherit" />
    </Tooltip>
  );
};
