import { cn } from '@venusprotocol/ui';
import { LabeledInlineContent } from 'components/LabeledInlineContent';
import { useTranslation } from 'libs/translations';

export interface AvailableBalanceProps {
  readableBalance: string;
  label?: string;
  onClick?: () => void;
}

export const AvailableBalance: React.FC<AvailableBalanceProps> = ({
  onClick,
  label,
  readableBalance,
}) => {
  const { t } = useTranslation();

  const isDisabled = !onClick;

  return (
    <LabeledInlineContent label={label || t('availableBalance.label')}>
      <button
        className={cn('transition-colors', !isDisabled && 'cursor-pointer hover:text-blue')}
        type="button"
        disabled={isDisabled}
        onClick={onClick}
      >
        {readableBalance}
      </button>
    </LabeledInlineContent>
  );
};
