import { cn } from '@venusprotocol/ui';

import { useTranslation } from 'libs/translations';
import { InfoIcon } from '../InfoIcon';

export interface IsolatedAssetIndicatorProps {
  className?: string;
}

export const IsolatedAssetIndicator: React.FC<IsolatedAssetIndicatorProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <span className={cn('inline-flex items-center gap-x-1 text-yellow', className)}>
      <span className="text-b2s">{t('marketTable.assetColumn.isolated')}</span>

      <InfoIcon
        iconClassName="text-yellow"
        tooltip={t('marketTable.assetColumn.isolatedTooltip')}
      />
    </span>
  );
};
