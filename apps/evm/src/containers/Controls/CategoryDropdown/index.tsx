import { Button, cn } from '@venusprotocol/ui';

import { Dropdown, Icon } from 'components';
import { useTranslation } from 'libs/translations';
import type { MarketCategory } from 'types';

export interface CategoryDropdownProps {
  categories: MarketCategory[];
  selectedTags: string[];
  onChange: (selectedTags: string[]) => void;
  className?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedTags,
  onChange,
  className,
}) => {
  const { t } = useTranslation();

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const toggleTag = (tag: string) =>
    onChange(
      selectedTags.includes(tag)
        ? selectedTags.filter(selectedTag => selectedTag !== tag)
        : [...selectedTags, tag],
    );

  let triggerLabel = t('controls.categoryFilter.allCategories');
  if (selectedTags.length === 1) {
    triggerLabel =
      sortedCategories.find(category => category.tag === selectedTags[0])?.label ?? triggerLabel;
  } else if (selectedTags.length > 1) {
    triggerLabel = t('controls.categoryFilter.nCategories', { count: selectedTags.length });
  }

  return (
    <Dropdown
      className={className}
      menuPosition="right"
      menuClassName="bg-background border-blue"
      optionsDom={() => (
        <div className="min-w-full">
          <div className="flex h-12 items-center justify-between px-4 py-3">
            <span className="text-b1r text-white">{t('controls.categoryFilter.title')}</span>

            <button
              type="button"
              onClick={() => onChange([])}
              disabled={selectedTags.length === 0}
              className="text-blue text-b1r cursor-pointer underline disabled:cursor-default disabled:opacity-50"
            >
              {t('controls.categoryFilter.reset')}
            </button>
          </div>

          {sortedCategories.map(category => (
            <button
              key={category.tag}
              type="button"
              onClick={() => toggleTag(category.tag)}
              className="hover:bg-background-hover active:bg-background-hover flex h-12 w-full cursor-pointer items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-b1r whitespace-nowrap text-white">{category.label}</span>

              <Icon
                name={selectedTags.includes(category.tag) ? 'checked' : 'checkboxBorder'}
                className="size-5 shrink-0"
              />
            </button>
          ))}
        </div>
      )}
    >
      {({ isDropdownOpen, handleToggleDropdown }) => (
        <Button
          onClick={handleToggleDropdown}
          contentClassName="text-b1s w-full justify-center"
          className={cn(
            'border-dark-blue-hover hover:border-light-grey active:bg-dark-blue relative h-12 w-full rounded-lg bg-transparent px-4 hover:bg-transparent',
            isDropdownOpen && 'bg-dark-blue-active border-blue',
            selectedTags.length > 0 && 'border-blue',
          )}
        >
          <span className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left">
            {triggerLabel}
          </span>

          <Icon
            name="chevronDown"
            className={cn('text-grey ml-2 size-3 flex-none', isDropdownOpen && 'rotate-180')}
          />
        </Button>
      )}
    </Dropdown>
  );
};
