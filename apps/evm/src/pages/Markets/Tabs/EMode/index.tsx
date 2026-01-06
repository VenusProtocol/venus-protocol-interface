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
import { useFormatTo } from 'hooks/useFormatTo';
import { useAnalytics } from 'libs/analytics';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { EModeAssetSettings, Pool } from 'types';
import { EModeGroup as EModeGroupComp } from './EModeGroup';
import { formatEModeGroups } from './formatEModeGroups';
import { useColumns } from './useColumns';

export interface EModeProps {
  pool: Pool;
  searchValue: string;
  onSearchValueChange: (newSearchValue: string) => void;
}

export const EMode: React.FC<EModeProps> = ({ pool, searchValue, onSearchValueChange }) => {
  const { t, Trans } = useTranslation();
  const columns = useColumns();
  const { captureAnalyticEvent } = useAnalytics();

  const { formatTo } = useFormatTo();
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const handleLearnMoreClick = () =>
    captureAnalyticEvent('e_mode_learn_more_click', {
      variant: 'e_mode_tab',
    });

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

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    onSearchValueChange(changeEvent.currentTarget.value);

  const formattedEModeGroups = formatEModeGroups({
    pool,
    vai,
    formatTo,
    searchValue,
  });

  return (
    <div className="space-y-6">
      <Notice
        description={
          <Trans
            i18nKey="markets.eMode.notice"
            components={{
              Link: <Link href={E_MODE_DOC_URL} onClick={handleLearnMoreClick} />,
            }}
          />
        }
      />

      <div className="space-y-4">
        <TextField
          className="sm:hidden"
          size="xs"
          value={searchValue}
          onChange={handleSearchInputChange}
          placeholder={t('markets.eMode.search.placeholder')}
          leftIconSrc="magnifier"
          variant="secondary"
        />

        <Select
          className="sm:hidden"
          label={t('markets.eMode.table.mobileSelectLabel')}
          placeLabelToLeft
          size="small"
          options={selectOptions}
          value={selectedOption?.value || selectOptions[0].value}
          onChange={handleOrderChange}
        />

        {formattedEModeGroups.map(extendedEModeGroup => (
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
    </div>
  );
};
