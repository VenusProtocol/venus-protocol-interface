import { Select, type SelectOption } from 'components';
import { supportedLanguages, useTranslation } from 'libs/translations';

const selectOptions: SelectOption<string>[] = supportedLanguages.map(language => ({
  value: language.bcp47Tag,
  label: language.name,
}));

export const LanguageSetting: React.FC = () => {
  const { t, i18n, language } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-x-3">
      <p className="text-light-grey">{t('layout.menu.settings.language.label')}</p>

      <Select
        value={language.bcp47Tag}
        onChange={tag => i18n.changeLanguage(tag as string)}
        options={selectOptions}
        dropdownClassName="lg:overflow-auto lg:max-h-48"
        menuPosition="right"
        className="w-40"
        buttonClassName="text-light-grey"
      />
    </div>
  );
};
