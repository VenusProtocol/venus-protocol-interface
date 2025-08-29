import { cn } from '@venusprotocol/ui';

import { HealthFactorPill, Icon } from 'components';
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
      <p className="text-grey text-sm">{t('pool.eMode.group.healthFactor')}</p>

      <div className="flex items-center gap-x-2">
        <HealthFactorPill factor={healthFactor} />

        <Icon name="arrowShaft" className="text-offWhite" />

        <HealthFactorPill factor={hypotheticalHealthFactor} />
      </div>
    </div>
  );
};
