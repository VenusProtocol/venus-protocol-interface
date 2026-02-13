import { cn } from '@venusprotocol/ui';

import { HealthFactorPill, ValueUpdate } from 'components';
import { useTranslation } from 'libs/translations';

export interface HealthFactorUpdateProps {
  healthFactor: number;
  hypotheticalHealthFactor: number;
  className?: string;
}

export const HealthFactorUpdate: React.FC<HealthFactorUpdateProps> = ({
  healthFactor,
  hypotheticalHealthFactor,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn('flex items-center gap-x-3', className)}>
      <p className="text-grey text-sm">{t('markets.tabs.eMode.group.healthFactor')}</p>

      <ValueUpdate
        original={<HealthFactorPill factor={healthFactor} />}
        update={<HealthFactorPill factor={hypotheticalHealthFactor} showLabel />}
      />
    </div>
  );
};
