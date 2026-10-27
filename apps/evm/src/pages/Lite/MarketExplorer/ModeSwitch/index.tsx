import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';

export type MarketMode = 'earn' | 'borrow';

export interface ModeSwitchProps {
  mode: MarketMode;
  onChange: (mode: MarketMode) => void;
}

const MODES: MarketMode[] = ['earn', 'borrow'];

export const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, onChange }) => {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('lite.modes.label')}
      className="flex h-9 shrink-0 gap-0 rounded-lg border border-border-raised bg-dark-blue p-1 shadow-raised"
    >
      {MODES.map(item => (
        <button
          key={item}
          type="button"
          aria-pressed={mode === item}
          onClick={() => onChange(item)}
          className={cn(
            'w-20 cursor-pointer rounded-md border border-transparent text-b1r transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue',
            mode === item
              ? 'bg-action border-border-action font-semibold text-white shadow-action-selected'
              : 'text-light-grey',
          )}
        >
          {t(`lite.modes.${item}`)}
        </button>
      ))}
    </div>
  );
};
