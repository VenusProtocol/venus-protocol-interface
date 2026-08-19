import type { InputHTMLAttributes } from 'react';

import { MultiSelect, TextField, Toggle } from 'components';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { MarketCategory } from 'types';

export interface ControlsProps {
  searchValue: string;
  onSearchValueChange: (newValue: string) => void;
  searchInputPlaceholder: string;
  showPausedAssetsToggle: boolean;
  categories?: MarketCategory[];
  selectedCategories?: string[];
  onSelectedCategoriesChange?: (selectedTags: string[]) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  searchValue,
  onSearchValueChange,
  searchInputPlaceholder,
  showPausedAssetsToggle,
  categories,
  selectedCategories = [],
  onSelectedCategoriesChange,
}) => {
  const { t } = useTranslation();
  const [userChainSettings, setUserChainSettings] = useUserChainSettings();
  const { accountAddress } = useAccountAddress();

  const setShowUserAssetsOnly = (value: boolean) =>
    setUserChainSettings({ showUserAssetsOnly: value });

  const setShowPausedAssets = (value: boolean) => setUserChainSettings({ showPausedAssets: value });

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    onSearchValueChange(changeEvent.currentTarget.value);

  const sortedCategories = [...(categories ?? [])]
    .sort((a, b) => a.order - b.order)
    .map(category => ({ value: category.tag, label: category.label }));

  return (
    <div className="@container/controls">
      <div className="flex flex-col gap-y-3 @2xl:items-center @2xl:flex-row @2xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row @2xl:grow @2xl:max-w-142">
          <TextField
            size="sm"
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder={searchInputPlaceholder}
            leftIconSrc="magnifier"
            className="sm:grow @2xl:max-w-75"
          />

          {sortedCategories.length > 1 && onSelectedCategoriesChange && (
            <MultiSelect
              options={sortedCategories}
              value={selectedCategories}
              onChange={onSelectedCategoriesChange}
              placeholder={t('controls.categoryFilter.allCategories')}
              renderCount={count => t('controls.categoryFilter.nCategories', { count })}
              title={t('controls.categoryFilter.title')}
              resetLabel={t('controls.categoryFilter.reset')}
              className="shrink-0 sm:w-52"
            />
          )}
        </div>

        {(!!accountAddress || showPausedAssetsToggle) && (
          <div className="flex items-center justify-between gap-x-6 sm:justify-start">
            {!!accountAddress && (
              <Toggle
                onChange={() => setShowUserAssetsOnly(!userChainSettings.showUserAssetsOnly)}
                value={userChainSettings.showUserAssetsOnly}
                label={t('controls.userAssetsOnlyToggle.label')}
              />
            )}

            {showPausedAssetsToggle && (
              <Toggle
                onChange={() => setShowPausedAssets(!userChainSettings.showPausedAssets)}
                value={userChainSettings.showPausedAssets}
                label={t('controls.pausedAssetsToggle.label')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
