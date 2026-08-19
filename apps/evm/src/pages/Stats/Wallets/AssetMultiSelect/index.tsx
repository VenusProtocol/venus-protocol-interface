import { cn } from '@venusprotocol/ui';

import { Checkbox, Dropdown } from 'components';

export interface AssetMultiSelectOption {
  value: string;
  label: string;
  iconSrc?: string;
}

export interface AssetMultiSelectProps {
  label: string;
  options: AssetMultiSelectOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  className?: string;
}

export const AssetMultiSelect: React.FC<AssetMultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  className,
}) => {
  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(selected => selected !== value));
      return;
    }
    onChange([...selectedValues, value]);
  };

  const summary = selectedValues.length > 0 ? `${label} (${selectedValues.length})` : label;

  return (
    <Dropdown
      className={className}
      menuTitle={label}
      optionsDom={() => (
        <div className="max-h-72 overflow-y-auto py-1">
          {options.map(option => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-x-2 px-3 py-2 hover:bg-lightGrey/10"
            >
              <Checkbox
                value={selectedValues.includes(option.value)}
                onChange={() => toggleValue(option.value)}
              />

              {option.iconSrc && <img alt="" src={option.iconSrc} className="size-5" />}

              <span className="text-b2 text-white">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    >
      {({ handleToggleDropdown }) => (
        <button
          type="button"
          onClick={handleToggleDropdown}
          className={cn(
            'flex h-10 items-center gap-x-2 rounded-lg border border-lightGrey px-3 text-b2',
            selectedValues.length > 0 ? 'text-white' : 'text-grey',
          )}
        >
          {summary}
        </button>
      )}
    </Dropdown>
  );
};
