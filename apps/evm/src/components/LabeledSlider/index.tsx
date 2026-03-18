import { Slider } from 'components';
import { useTranslation } from 'libs/translations';

export interface LabeledSliderProps {
  value: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
}

export const LabeledSlider: React.FC<LabeledSliderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Slider disabled={disabled} value={value} onChange={onChange} max={100} step={1} />

      <div className="flex justify-between text-grey text-xs">
        <p>{t('operationForm.riskSlider.0')}</p>
        <p>{t('operationForm.riskSlider.100')}</p>
      </div>
    </div>
  );
};
