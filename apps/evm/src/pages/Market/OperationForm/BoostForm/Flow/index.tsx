import { Icon } from 'components';
import { useTranslation } from 'libs/translations';

export interface FlowProps {
  fromTokenSymbol: string;
  toTokenSymbol: string;
}

export const Flow: React.FC<FlowProps> = ({ fromTokenSymbol, toTokenSymbol }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-x-[2px] text-grey text-sm">
      <p>
        {t('operationForm.boost.flows.borrow', {
          tokenSymbol: fromTokenSymbol,
        })}
      </p>

      <Icon className="w-5 h-5" name="chevronRight" />

      <p>{t('operationForm.boost.flows.swap')}</p>

      <Icon className="w-5 h-5" name="chevronRight" />

      <p>
        {t('operationForm.boost.flows.supply', {
          tokenSymbol: toTokenSymbol,
        })}
      </p>
    </div>
  );
};
