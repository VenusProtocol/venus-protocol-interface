import { cn } from '@venusprotocol/ui';
import type { InputHTMLAttributes } from 'react';

import { TextField, Toggle } from 'components';
import { useTranslation } from 'libs/translations';

export interface MarketTableControlsProps {
  searchValue: string;
  onSearchValueChange: (search: string) => void;
  onShowUserAssetsOnlyToggleChange: (value: boolean) => void;
  onShowPausedAssetsToggleChange: (value: boolean) => void;
  showPausedAssets?: boolean;
  showUserAssetsOnly?: boolean;
  className?: string;
}

export const MarketTableControls: React.FC<MarketTableControlsProps> = ({
  onShowUserAssetsOnlyToggleChange,
  onShowPausedAssetsToggleChange,
  showPausedAssets,
  searchValue,
  onSearchValueChange,
  showUserAssetsOnly,
  className,
}) => {
  const { t } = useTranslation();

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    onSearchValueChange(changeEvent.currentTarget.value);

  return (
    <div
      className={cn('space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between', className)}
    >
      <div className="flex items-center gap-x-4">
        {showPausedAssets !== undefined && (
          <Toggle
            onChange={() => onShowPausedAssetsToggleChange(!showPausedAssets)}
            value={showPausedAssets}
            label={t('marketTableControls.pausedAssetsToggle.label')}
          />
        )}

        {showUserAssetsOnly !== undefined && (
          <Toggle
            onChange={() => onShowUserAssetsOnlyToggleChange(!showUserAssetsOnly)}
            value={showUserAssetsOnly}
            label={t('marketTableControls.userAssetsOnlyToggle.label')}
          />
        )}
      </div>

      <TextField
        className="lg:w-[300px]"
        isSmall
        value={searchValue}
        onChange={handleSearchInputChange}
        placeholder={t('marketTableControls.searchInput.placeholder')}
        leftIconSrc="magnifier"
        variant="secondary"
      />

      {/* TODO: add mobile select to sort assets */}
    </div>
  );
};
