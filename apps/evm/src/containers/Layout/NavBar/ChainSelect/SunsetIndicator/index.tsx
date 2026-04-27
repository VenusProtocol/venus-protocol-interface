import { cn } from '@venusprotocol/ui';
import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { useSunsetModalStore } from './store';

export interface SunsetIndicatorProps {
  className?: string;
}

export const SunsetIndicator: React.FC<SunsetIndicatorProps> = ({ className }) => {
  const { t } = useTranslation();
  const open = useSunsetModalStore(state => state.open);

  const handleOpen = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    open();
  };

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onMouseDown={e => e.stopPropagation()}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleOpen(e);
        }
      }}
      aria-label={t('layout.sunsetModal.indicatorAriaLabel')}
      className={cn('flex flex-none cursor-pointer items-center justify-center', className)}
    >
      <Icon name="sunset" className="size-5 text-[#FF6A00]" />
    </span>
  );
};
