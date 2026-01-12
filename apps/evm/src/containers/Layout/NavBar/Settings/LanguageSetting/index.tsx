import { Select, type SelectOption } from 'components';
import { useTranslation } from 'libs/translations';
import { supportedLanguages } from 'libs/translations/constants';

const selectOptions: SelectOption<string>[] = supportedLanguages.map(language => ({
  value: language.tag,
  label: language.name,
}));

export const LanguageSetting: React.FC = () => {
  const { t, i18n } = useTranslation();

  console.log(i18n.language, i18n.resolvedLanguage);

  return (
    <div className="flex flex-col gap-y-3 xl:flex-row xl:justify-between xl:items-center xl:gap-y-0">
      <p>{t('layout.menu.settings.language.label')}</p>

      <Select
        value={i18n.resolvedLanguage || supportedLanguages[0].tag}
        onChange={tag => i18n.changeLanguage(tag as string)}
        options={selectOptions}
        dropdownClassName="xl:overflow-auto xl:max-h-48"
      />
    </div>
  );
};
