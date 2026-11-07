import { ButtonGroup, Icon } from 'components';
import { type Theme, useTheme } from 'hooks/useTheme';
import { useTranslation } from 'libs/translations';

const THEMES: Theme[] = ['dark', 'light'];

export const ThemeSetting: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const themes = [
    { iconName: 'moon' as const, label: t('layout.menu.settings.theme.dark') },
    { iconName: 'sun' as const, label: t('layout.menu.settings.theme.light') },
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
        activeButtonIndex={THEMES.indexOf(theme)}
        onButtonClick={index => setTheme(THEMES[index])}
        buttonClassName="h-10 w-11 px-0"
      />
    </div>
  );
};
