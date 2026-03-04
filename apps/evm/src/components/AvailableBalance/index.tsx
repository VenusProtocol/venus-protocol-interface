import { LabeledInlineContent } from 'components/LabeledInlineContent';
import { useTranslation } from 'libs/translations';

export interface AvailableBalanceProps {
  readableBalance: string;
  onClick?: () => void;
}

export const AvailableBalance: React.FC<AvailableBalanceProps> = ({ onClick, readableBalance }) => {
  const { t } = useTranslation();

  return (
    <LabeledInlineContent label={t('availableBalance.label')}>
      <button
        className="transition-colors cursor-pointer hover:text-blue"
        type="button"
        disabled={!onClick}
        onClick={onClick}
      >
        {readableBalance}
      </button>
    </LabeledInlineContent>
  );
};
