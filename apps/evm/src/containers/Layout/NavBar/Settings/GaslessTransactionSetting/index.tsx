import { type ChainId, chains as chainMetadata } from '@venusprotocol/chains';

import { Icon, Toggle } from 'components';
import { useTranslation } from 'libs/translations';
import { store } from 'store';

export interface GaslessTransactionSettingProps {
  chainId: ChainId;
}

export const GaslessTransactionSetting: React.FC<GaslessTransactionSettingProps> = ({
  chainId,
}) => {
  const { t } = useTranslation();

  const userSettings = store.use.userSettings()[chainId];
  const setUserSettings = store.use.setUserSettings();

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
        <div className="flex flex-col gap-y-3 xl:gap-y-0 xl:flex-row xl:gap-x-1 xl:items-center">
          <Icon name="gasSlashed" className="text-green size-4" />

          <p className="text-sm">
            {t('layout.menu.gasLessTransactionSetting.label', {
              chainName,
            })}
          </p>
        </div>

        <p className="text-xs text-light-grey">
          {t('layout.menu.gasLessTransactionSetting.description')}
        </p>
      </div>

      <Toggle onChange={toggle} value={userSettings?.gaslessTransactions ?? false} />
    </div>
  );
};
