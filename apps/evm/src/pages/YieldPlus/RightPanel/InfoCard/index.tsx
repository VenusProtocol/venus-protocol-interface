import { cn } from '@venusprotocol/ui';
import { Icon } from 'components/Icon';
import { useTranslation } from 'libs/translations';

const STORAGE_KEY = 'yieldPlus.infoCardDismissed';

export const useInfoCardDismissed = () => {
  const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true';

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  return { isDismissed, dismiss };
};

export interface InfoCardProps {
  onDismiss: () => void;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ onDismiss, className }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'rounded-xl bg-cards border border-lightGrey p-4 flex items-start justify-between gap-3',
        className,
      )}
    >
      <p className="text-b1s text-white">
        {t('yieldPlus.infoCard.title')},{' '}
        <button
          type="button"
          className="text-blue hover:underline font-semibold"
          onClick={onDismiss}
        >
          {t('yieldPlus.infoCard.howItWorks')}
        </button>
      </p>

      <button
        type="button"
        onClick={onDismiss}
        className="text-grey hover:text-white transition-colors shrink-0 mt-0.5"
        aria-label={t('yieldPlus.infoCard.dismiss')}
      >
        <Icon name="close" className="size-4" />
      </button>
    </div>
  );
};
