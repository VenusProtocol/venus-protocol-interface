import { type InputHTMLAttributes, useState } from 'react';

import {
  Notice,
  type Order,
  Select,
  type SelectOption,
  type SelectProps,
  TextField,
} from 'components';
import { E_MODE_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import type { EModeAssetSettings, EModeGroup, Pool } from 'types';
import { EModeGroup as EModeGroupComp } from './EModeGroup';
import { useGetColumns } from './useGetColumns';

export interface EModeProps {
  pool: Pool;
  searchValue: string;
  onSearchValueChange: (newSearchValue: string) => void;
}

export const EMode: React.FC<EModeProps> = ({ pool, searchValue, onSearchValueChange }) => {
  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    onSearchValueChange(changeEvent.currentTarget.value);

  const { t, Trans } = useTranslation();
  const columns = useGetColumns();

  const initialOrder: Order<EModeAssetSettings> = {
    orderBy: columns[1],
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

  // Handle search
  const filteredEModeGroups = pool.eModeGroups.reduce<EModeGroup[]>((acc, eModeGroup) => {
    const searchMatches = (value: string) =>
      value.toLowerCase().includes(searchValue.toLowerCase());

    const filteredEModeAssetSettings = eModeGroup.assetSettings.filter(settings =>
      searchMatches(settings.vToken.underlyingToken.symbol),
    );

    const nameMatches = searchMatches(eModeGroup.name);

    if (filteredEModeAssetSettings.length === 0 && !nameMatches) {
      // Filter out E-mode group
      return acc;
    }

    const formattedEModeGroup: EModeGroup = {
      ...eModeGroup,
      assetSettings: filteredEModeAssetSettings,
    };

    return [...acc, formattedEModeGroup];
  }, []);

  return (
    <div className="space-y-6">
      <Notice
        description={
          <Trans
            i18nKey="pool.eMode.notice"
            components={{
              Link: <Link href={E_MODE_DOC_URL} />,
            }}
          />
        }
      />

      <div className="space-y-4">
        <TextField
          className="sm:hidden"
          isSmall
          value={searchValue}
          onChange={handleSearchInputChange}
          placeholder={t('pool.eMode.search.placeholder')}
          leftIconSrc="magnifier"
          variant="secondary"
        />

        <Select
          className="sm:hidden"
          label={t('pool.eMode.table.mobileSelectLabel')}
          placeLabelToLeft
          size="small"
          options={selectOptions}
          value={selectedOption?.value || selectOptions[0].value}
          onChange={handleOrderChange}
        />

        {filteredEModeGroups.map(eModeGroup => (
          <EModeGroupComp
            key={eModeGroup.id}
            eModeGroup={eModeGroup}
            pool={pool}
            columns={columns}
            initialOrder={initialOrder}
            mobileOrder={order}
          />
        ))}
      </div>
    </div>
  );
};
