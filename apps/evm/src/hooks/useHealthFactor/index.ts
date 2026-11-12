import { cn, theme } from '@venusprotocol/ui';
import {
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
  HEALTH_FACTOR_MODERATE_THRESHOLD,
  HEALTH_FACTOR_SAFE_THRESHOLD,
} from 'constants/healthFactor';
import { useTranslation } from 'libs/translations';

export const useHealthFactor = ({ value }: { value: number }) => {
  const { t } = useTranslation();

  let borderClass = cn('border-danger');
  let bgClass = cn('bg-danger');
  let onBgTextClass = cn('text-on-emphasis');
  let textClass = cn('text-danger');
  let bgSemiTransparentClass = cn('bg-danger/10');
  let label = t('healthFactor.label.liquidation');
  let color = theme.colors.red;

  if (value >= HEALTH_FACTOR_SAFE_THRESHOLD) {
    label = t('healthFactor.label.healthy');
    textClass = cn('text-success');
    borderClass = cn('border-success');
    bgClass = cn('bg-success');
    bgSemiTransparentClass = cn('bg-success/10');
    color = theme.colors.green;
  } else if (value >= HEALTH_FACTOR_MODERATE_THRESHOLD) {
    label = t('healthFactor.label.moderate');
    textClass = cn('text-warning');
    borderClass = cn('border-warning');
    bgClass = cn('bg-warning');
    onBgTextClass = cn('text-on-warning');
    bgSemiTransparentClass = cn('bg-warning/10');
    color = theme.colors.yellow;
  } else if (value > HEALTH_FACTOR_LIQUIDATION_THRESHOLD) {
    label = t('healthFactor.label.risky');
  }

  return {
    label,
    textClass,
    bgClass,
    onBgTextClass,
    bgSemiTransparentClass,
    borderClass,
    color,
  };
};
