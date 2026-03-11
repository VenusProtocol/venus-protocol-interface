import { cn } from '@venusprotocol/ui';
import { Icon } from 'components';
import { useTranslation } from 'libs/translations';

export interface SlippageSettingsProps {
  slippage?: number;
  priceImpact?: string;
  className?: string;
}

export const SlippageSettings: React.FC<SlippageSettingsProps> = ({
  slippage = 0.5,
  priceImpact = '-',
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-1">
        <span className="text-b2r text-grey">
          {t('yieldPlus.form.slippageTolerance')} {slippage}%
        </span>
        <Icon
          name="gear"
          className="text-grey size-3 cursor-pointer hover:text-white transition-colors"
        />
      </div>

      <div className="flex items-center gap-1">
        <span className="text-b2r text-grey">{t('yieldPlus.form.priceImpact')}</span>
        <span className="text-b2r text-grey">{priceImpact}</span>
      </div>
    </div>
  );
};
