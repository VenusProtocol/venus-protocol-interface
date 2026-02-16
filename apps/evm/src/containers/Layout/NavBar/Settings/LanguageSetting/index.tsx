import { Select, type SelectOption } from 'components';
import { supportedLanguages, useTranslation } from 'libs/translations';

const selectOptions: SelectOption<string>[] = supportedLanguages.map(language => ({
  value: language.bcp47Tag,
  label: language.name,
}));

export const LanguageSetting: React.FC = () => {
  const { t, i18n, language } = useTranslation();

  return (
    <div className="flex flex-col gap-y-3 xl:flex-row xl:justify-between xl:items-center xl:gap-y-0">
      <p>{t('layout.menu.settings.language.label')}</p>

      <Select
        value={language.bcp47Tag}
        onChange={tag => i18n.changeLanguage(tag as string)}
        options={selectOptions}
        dropdownClassName="xl:overflow-auto xl:max-h-48"
      />
    </div>
  );
};
