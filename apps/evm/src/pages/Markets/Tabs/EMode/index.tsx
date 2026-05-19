import { useState } from 'react';

import { Notice, type Order } from 'components';
import { Controls } from 'containers/Controls';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';
import type { ExtendedEModeAssetSettings, ExtendedEModeGroup } from '../types';
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

  const initialOrder: Order<ExtendedEModeAssetSettings> = {
    orderBy: columns[3],
    orderDirection: 'desc',
  };

  const [searchValue, setSearchValue] = useState('');

  const filteredEModeGroups = filterEModeGroups({
    pool,
    extendedEModeGroups,
    searchValue,
    showPausedAssets: userChainSettings.showPausedAssets,
    showUserAssetsOnly: userChainSettings.showUserAssetsOnly,
  });

  return (
    <div className="space-y-6 sm:p-6 sm:rounded-lg sm:border sm:border-dark-blue-hover">
      <Notice description={notice} />

      <Controls
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        searchInputPlaceholder={t('markets.tabs.eMode.table.searchPlaceholder')}
        showPausedAssetsToggle
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
          mobileOrder={initialOrder}
        />
      ))}
    </div>
  );
};
