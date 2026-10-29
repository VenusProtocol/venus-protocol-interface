import { cn } from '@venusprotocol/ui';
import { Icon } from 'components';
import { useTranslation } from 'libs/translations';

const THEMES = [
  { id: 'dark', iconName: 'moon', isActive: true },
  { id: 'light', iconName: 'sun', isActive: false },
] as const;

export const ThemeSetting: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-3 lg:flex-row lg:justify-between lg:items-center lg:gap-y-0">
      <p>{t('layout.menu.settings.theme.label')}</p>

      <div
        role="group"
        aria-label={t('layout.menu.settings.theme.label')}
        className="flex items-center gap-1 rounded-lg border border-dark-blue-hover bg-background-active p-1"
      >
        {THEMES.map(theme => (
          <button
            key={theme.id}
            type="button"
            disabled
            aria-pressed={theme.isActive}
            aria-label={
              theme.isActive
                ? t('layout.menu.settings.theme.dark')
                : t('layout.menu.settings.theme.light')
            }
            className={cn(
              'flex size-9 items-center justify-center rounded-md disabled:cursor-not-allowed',
              theme.isActive ? 'bg-blue text-white' : 'text-light-grey opacity-45',
            )}
          >
            <Icon name={theme.iconName} className="size-5 text-inherit" />
          </button>
        ))}
      </div>
    </div>
  );
};
