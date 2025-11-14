import { cn } from '@venusprotocol/ui';

import { Slider } from 'components';
import { useTranslation } from 'libs/translations';

export interface RiskSliderProps {
  value: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
}

export const RiskSlider: React.FC<RiskSliderProps> = ({ value, onChange, disabled = false }) => {
  const { t } = useTranslation();

  let rangeClassName = 'bg-green';

  if (value > 75) {
    rangeClassName = 'bg-red';
  } else if (value >= 50) {
    rangeClassName = 'bg-orange';
  } else if (value >= 25) {
    rangeClassName = 'bg-yellow';
  }

  return (
    <div className="space-y-2">
      <Slider
        disabled={disabled}
        value={value}
        onChange={onChange}
        max={100}
        step={1}
        rangeClassName={cn('transition-colors', rangeClassName)}
      />

      <div className="flex justify-between text-grey text-xs">
        <p>{t('operationForm.riskSlider.lowRisk')}</p>

        <p>{t('operationForm.riskSlider.highRisk')}</p>
      </div>
    </div>
  );
};
