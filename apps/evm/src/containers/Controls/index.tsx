import type { InputHTMLAttributes } from 'react';

import { TextField, Toggle } from 'components';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';

export interface ControlsProps {
  searchValue: string;
  onSearchValueChange: (newValue: string) => void;
  searchInputPlaceholder: string;
}

export const Controls: React.FC<ControlsProps> = ({
  searchValue,
  onSearchValueChange,
  searchInputPlaceholder,
}) => {
  const { t } = useTranslation();
  const [userChainSettings, setUserChainSettings] = useUserChainSettings();
  const { accountAddress } = useAccountAddress();

  const setShowUserAssetsOnly = (value: boolean) =>
    setUserChainSettings({ showUserAssetsOnly: value });

  const setShowPausedAssets = (value: boolean) => setUserChainSettings({ showPausedAssets: value });

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    onSearchValueChange(changeEvent.currentTarget.value);

  return (
    <div className="space-y-3 md:space-y-0 md:flex sm:items-center md:justify-between">
      <TextField
        size="xs"
        value={searchValue}
        onChange={handleSearchInputChange}
        placeholder={searchInputPlaceholder}
        leftIconSrc="magnifier"
        className="md:grow md:max-w-75"
      />

      <div className="flex items-center justify-between gap-x-6 sm:justify-start">
        {!!accountAddress && (
          <Toggle
            onChange={() => setShowUserAssetsOnly(!userChainSettings.showUserAssetsOnly)}
            value={userChainSettings.showUserAssetsOnly}
            label={t('controls.userAssetsOnlyToggle.label')}
          />
        )}

        <Toggle
          onChange={() => setShowPausedAssets(!userChainSettings.showPausedAssets)}
          value={userChainSettings.showPausedAssets}
          label={t('controls.pausedAssetsToggle.label')}
        />
      </div>
    </div>
  );
};
