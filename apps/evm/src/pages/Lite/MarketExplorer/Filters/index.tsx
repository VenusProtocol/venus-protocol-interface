import { MultiSelect, type MultiSelectOption, TextField } from 'components';
import { useTranslation } from 'libs/translations';

export interface FiltersProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  searchPlaceholder: string;
  searchAriaLabel: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
  optionsPlaceholder: string;
  optionsTitle: string;
  renderOptionCount: (count: number) => string;
}

export const Filters: React.FC<FiltersProps> = ({
  searchValue,
  onSearchValueChange,
  searchPlaceholder,
  searchAriaLabel,
  options,
  selectedValues,
  onSelectedValuesChange,
  optionsPlaceholder,
  optionsTitle,
  renderOptionCount,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] items-center gap-2 sm:flex sm:grow sm:flex-wrap sm:justify-end sm:gap-3">
      <TextField
        size="sm"
        aria-label={searchAriaLabel}
        placeholder={searchPlaceholder}
        leftIconSrc="magnifier"
        value={searchValue}
        onChange={event => onSearchValueChange(event.target.value)}
        className="min-w-0 sm:min-w-40 sm:flex-1 sm:max-w-60"
        inputContainerClassName="h-11 px-3 py-1 sm:h-9 [&_svg]:size-4"
        inputClassName="text-b1r font-normal"
      />

      <MultiSelect
        options={options}
        value={selectedValues}
        onChange={onSelectedValuesChange}
        placeholder={optionsPlaceholder}
        title={optionsTitle}
        resetLabel={t('lite.filters.reset')}
        renderCount={renderOptionCount}
        className="w-full min-w-0 shrink-0 sm:w-45"
        buttonClassName="h-11 px-3 py-1 sm:h-9"
      />
    </div>
  );
};
