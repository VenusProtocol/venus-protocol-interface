import { ButtonGroup, Icon } from 'components';
import { useTranslation } from 'libs/translations';

export const ThemeSetting: React.FC = () => {
  const { t } = useTranslation();

  const themes = [
    { iconName: 'moon' as const, label: t('layout.menu.settings.theme.dark') },
    { iconName: 'sun' as const, label: t('layout.menu.settings.theme.light') },
  ];

  return (
    <div className="flex flex-col gap-y-3 lg:flex-row lg:justify-between lg:items-center lg:gap-y-0">
      <p className="text-light-grey">{t('layout.menu.settings.theme.label')}</p>

      <ButtonGroup
        ariaLabel={t('layout.menu.settings.theme.label')}
        buttonLabels={themes.map(theme => (
          <>
            <Icon name={theme.iconName} className="size-5 text-inherit" />
            <span className="sr-only">{theme.label}</span>
          </>
        ))}
        activeButtonIndex={0}
        onButtonClick={() => {}}
        disabled
        buttonClassName="h-10 w-11 px-0"
      />
    </div>
  );
};
