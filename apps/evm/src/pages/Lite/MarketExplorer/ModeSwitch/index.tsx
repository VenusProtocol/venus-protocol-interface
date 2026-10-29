import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';

export type MarketMode = 'earn' | 'borrow';

export interface ModeSwitchProps {
  mode: MarketMode;
  onChange: (mode: MarketMode) => void;
}

export const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, onChange }) => {
  const { t } = useTranslation();

  const modes: { id: MarketMode; label: string }[] = [
    { id: 'earn', label: t('lite.modes.earn') },
    { id: 'borrow', label: t('lite.modes.borrow') },
  ];

  return (
    <div
      role="group"
      aria-label={t('lite.modes.label')}
      className="flex h-9 w-full shrink-0 gap-0 rounded-lg border border-border-raised bg-dark-blue p-1 shadow-raised sm:w-auto"
    >
      {modes.map(item => (
        <button
          key={item.id}
          type="button"
          aria-pressed={mode === item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'flex-1 cursor-pointer rounded-md border border-transparent text-b1r transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:w-20 sm:flex-none',
            mode === item.id
              ? 'bg-action border-border-action font-semibold text-white shadow-action-selected'
              : 'text-light-grey',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
