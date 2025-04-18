import { cn, theme } from '@venusprotocol/ui';
import {
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
  HEALTH_FACTOR_MODERATE_THRESHOLD,
  HEALTH_FACTOR_SAFE_THRESHOLD,
} from 'constants/healthFactor';
import { useTranslation } from 'libs/translations';

export const useHealthFactor = ({ value }: { value: number }) => {
  const { t } = useTranslation();

  let borderClass = cn('border-red');
  let bgClass = cn('bg-red');
  let textClass = cn('text-red');
  let bgSemiTransparentClass = cn('bg-red/10');
  let label = t('healthFactor.label.liquidation');
  let color = theme.colors.red;

  if (value >= HEALTH_FACTOR_SAFE_THRESHOLD) {
    label = t('healthFactor.label.healthy');
    textClass = cn('text-green');
    borderClass = cn('border-green');
    bgClass = cn('bg-green');
    bgSemiTransparentClass = cn('bg-green/10');
    color = theme.colors.green;
  } else if (value >= HEALTH_FACTOR_MODERATE_THRESHOLD) {
    label = t('healthFactor.label.moderate');
    textClass = cn('text-yellow');
    borderClass = cn('border-yellow');
    bgClass = cn('bg-yellow');
    bgSemiTransparentClass = cn('bg-yellow/10');
    color = theme.colors.yellow;
  } else if (value > HEALTH_FACTOR_LIQUIDATION_THRESHOLD) {
    label = t('healthFactor.label.risky');
  }

  return {
    label,
    textClass,
    bgClass,
    bgSemiTransparentClass,
    borderClass,
    color,
  };
};
