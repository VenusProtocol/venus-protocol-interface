import { Icon } from 'components';
import { useTranslation } from 'libs/translations';

export interface EmptyStateProps {
  title: string;
  hint?: string;
  showIcon?: boolean;
  onClear?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  hint,
  showIcon = false,
  onClear,
}) => {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      className="flex min-h-50 w-full flex-col items-center justify-center gap-1.5 px-4 py-8 text-center text-secondary md:min-h-55 md:gap-2 md:px-5 md:py-10 lg:min-h-60 lg:px-6 lg:py-12"
    >
      {showIcon && <Icon name="magnifier" className="mb-1 size-8 opacity-55 md:size-10" />}

      <p className="wrap-anywhere text-p3s text-primary md:text-[18px]">{title}</p>

      {!!hint && <p className="text-b1r opacity-80">{hint}</p>}

      {!!onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 h-11 w-full max-w-70 cursor-pointer rounded-full border border-current px-5 text-b1r transition-colors hover:bg-hover hover:font-semibold focus-visible:bg-hover focus-visible:font-semibold focus-visible:outline-2 focus-visible:outline-brand md:h-10 md:w-auto md:max-w-none"
        >
          {t('lite.placeholders.clearSearch')}
        </button>
      )}
    </div>
  );
};
