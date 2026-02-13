import { useState } from 'react';

import { Notice, type Order, Select, type SelectOption, type SelectProps } from 'components';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import type { EModeAssetSettings, Pool } from 'types';
import { isAssetPaused } from 'utilities';
import { Controls } from '../Controls';
import type { ExtendedEModeGroup } from '../types';
import { EModeGroup as EModeGroupComp } from './EModeGroup';
import { filterEModeGroups } from './filterEModeGroups';
import { useColumns } from './useColumns';

export interface EModeProps {
  notice: React.ReactElement;
  pool: Pool;
  extendedEModeGroups: ExtendedEModeGroup[];
}

export const EMode: React.FC<EModeProps> = ({ pool, notice, extendedEModeGroups }) => {
  const { t } = useTranslation();
  const columns = useColumns();
  const [userChainSettings] = useUserChainSettings();

  const initialOrder: Order<EModeAssetSettings> = {
    orderBy: columns[3],
    orderDirection: 'desc',
  };

  const [order, setOrder] = useState<Order<EModeAssetSettings>>(initialOrder);

  const selectOptions = columns.reduce<SelectOption[]>((acc, column) => {
    if (!column.sortRows) {
      return acc;
    }

    const option: SelectOption = {
      value: column.key,
      label: column.selectOptionLabel,
    };

    return [...acc, option];
  }, []);

  const selectedOption = order && selectOptions.find(option => option.value === order.orderBy.key);

  const handleOrderChange: SelectProps['onChange'] = value => {
    const newSelectedOption = selectOptions.find(option => option.value === value);
    const orderBy =
      newSelectedOption && columns.find(column => column.key === newSelectedOption.value);

    if (orderBy) {
      setOrder({
        orderBy,
        orderDirection: 'desc',
      });
    }
  };

  const [searchValue, setSearchValue] = useState('');

  const filteredEModeGroups = filterEModeGroups({
    pool,
    extendedEModeGroups,
    searchValue,
    showPausedAssets: userChainSettings.showPausedAssets,
    showUserAssetsOnly: userChainSettings.showUserAssetsOnly,
  });

  const pausedAssetsExist = pool.assets.some(asset =>
    isAssetPaused({ disabledTokenActions: asset.disabledTokenActions }),
  );

  return (
    <div className="space-y-6 sm:p-6 sm:rounded-lg sm:border sm:border-dark-blue-hover">
      <Notice description={notice} />

      <Controls
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        showPausedAssetsToggle={pausedAssetsExist}
      />

      <Select
        className="sm:hidden"
        label={t('markets.tabs.eMode.table.mobileSelectLabel')}
        placeLabelToLeft
        size="small"
        options={selectOptions}
        value={selectedOption?.value || selectOptions[0].value}
        onChange={handleOrderChange}
      />

      {filteredEModeGroups.map(extendedEModeGroup => (
        <EModeGroupComp
          key={extendedEModeGroup.id}
          eModeGroup={extendedEModeGroup}
          userHasEnoughCollateral={extendedEModeGroup.userHasEnoughCollateral}
          userBlockingBorrowPositions={extendedEModeGroup.userBlockingBorrowPositions}
          hypotheticalUserHealthFactor={extendedEModeGroup.hypotheticalUserHealthFactor}
          pool={pool}
          columns={columns}
          initialOrder={initialOrder}
          mobileOrder={order}
        />
      ))}
    </div>
  );
};
