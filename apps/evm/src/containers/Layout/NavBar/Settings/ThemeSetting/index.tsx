import { ButtonGroup, Icon } from 'components';
import { type ThemePreference, useTheme } from 'hooks/useTheme';
import { useTranslation } from 'libs/translations';

const THEME_PREFERENCES: ThemePreference[] = ['dark', 'light', 'system'];

export const ThemeSetting: React.FC = () => {
  const { t } = useTranslation();
  const { preference, setTheme } = useTheme();

  const themes = [
    { iconName: 'moon' as const, label: t('layout.menu.settings.theme.dark') },
    { iconName: 'sun' as const, label: t('layout.menu.settings.theme.light') },
    { iconName: 'system' as const, label: t('layout.menu.settings.theme.system') },
  ];

  return (
    <div className="flex items-center justify-between gap-x-3">
      <p className="text-secondary">{t('layout.menu.settings.theme.label')}</p>

      <ButtonGroup
        ariaLabel={t('layout.menu.settings.theme.label')}
        buttonLabels={themes.map(item => (
          <>
            <Icon name={item.iconName} className="size-5 text-inherit" />
            <span className="sr-only">{item.label}</span>
          </>
        ))}
        activeButtonIndex={THEME_PREFERENCES.indexOf(preference)}
        onButtonClick={index => setTheme(THEME_PREFERENCES[index])}
        buttonClassName="h-10 w-11 px-0"
      />
    </div>
  );
};
