import { cn } from '@venusprotocol/ui';
import { useState } from 'react';

import { Notice, type Order, Select, type SelectOption, type SelectProps } from 'components';
import { Controls } from 'containers/Controls';
import { useFormatTo } from 'hooks/useFormatTo';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { EModeAssetSettings, EModeGroup, Pool } from 'types';
import { EModeGroupItem } from './EModeGroupItem';
import { formatEModeGroups } from './formatEModeGroups';
import { useColumns } from './useColumns';

export interface EModeGroupListProps {
  pool: Pool;
  eModeGroups: EModeGroup[];
  controls?: boolean;
  notice?: React.ReactElement;
  className?: string;
  onEModeAssetSettingsClick?: (e: React.MouseEvent, eModeGroup: EModeAssetSettings) => void;
}

export const EModeGroupList: React.FC<EModeGroupListProps> = ({
  pool,
  notice,
  controls = true,
  eModeGroups,
  onEModeAssetSettingsClick,
  className,
}) => {
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

  const { formatTo } = useFormatTo();
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const extendedEModeGroups = formatEModeGroups({
    pool,
    eModeGroups,
    searchValue,
    showUserAssetsOnly: userChainSettings.showUserAssetsOnly,
    formatTo,
    vai,
  });

  return (
    <div className={cn('space-y-6', className)}>
      {!!notice && <Notice description={notice} />}

      {controls && (
        <Controls
          searchValue={searchValue}
          searchInputPlaceholder={t('eModeGroupList.controls.searchPlaceholder')}
          onSearchValueChange={setSearchValue}
          showPausedAssetsToggle={false}
        />
      )}

      <Select
        className="sm:hidden"
        label={t('eModeGroupList.controls.mobileSelectLabel')}
        placeLabelToLeft
        size="small"
        options={selectOptions}
        value={selectedOption?.value || selectOptions[0].value}
        onChange={handleOrderChange}
      />

      {extendedEModeGroups.map(extendedEModeGroup => (
        <EModeGroupItem
          key={extendedEModeGroup.id}
          eModeGroup={extendedEModeGroup}
          userHasEnoughCollateral={extendedEModeGroup.userHasEnoughCollateral}
          userBlockingBorrowPositions={extendedEModeGroup.userBlockingBorrowPositions}
          hypotheticalUserHealthFactor={extendedEModeGroup.hypotheticalUserHealthFactor}
          pool={pool}
          columns={columns}
          initialOrder={initialOrder}
          mobileOrder={order}
          onEModeAssetSettingsClick={onEModeAssetSettingsClick}
        />
      ))}
    </div>
  );
};
