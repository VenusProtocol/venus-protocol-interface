import { type ChainId, chains as chainMetadata } from '@venusprotocol/chains';

import { Icon, Toggle } from 'components';
import { useTranslation } from 'libs/translations';
import { useStore } from 'store';

export interface GaslessTransactionSettingProps {
  chainId: ChainId;
}

export const GaslessTransactionSetting: React.FC<GaslessTransactionSettingProps> = ({
  chainId,
}) => {
  const { t } = useTranslation();

  const userSettings = useStore(state => state.userSettings)[chainId];
  const setUserSettings = useStore(state => state.setUserSettings);

  const chainName = chainMetadata[chainId].name;

  const toggle = () =>
    setUserSettings({
      settings: {
        gaslessTransactions: !userSettings?.gaslessTransactions,
      },
      chainIds: [chainId],
    });

  return (
    <div className="flex items-center gap-x-3 justify-between">
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-col gap-y-3 lg:gap-y-0 lg:flex-row lg:gap-x-1 lg:items-center">
          <Icon name="gasSlashed" className="text-green size-4" />

          <p className="text-sm">
            {t('layout.menu.settings.gasLessTransactions.label', {
              chainName,
            })}
          </p>
        </div>
      </div>

      <Toggle onChange={toggle} value={userSettings?.gaslessTransactions ?? false} />
    </div>
  );
};
