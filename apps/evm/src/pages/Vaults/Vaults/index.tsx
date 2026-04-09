import { Select, TextField, type TextFieldProps, cn } from 'components';
import { VaultCard } from 'containers/Vault/VaultCard';
import { useTranslation } from 'libs/translations';
import { type FC, type HTMLAttributes, useState } from 'react';
import type { Vault } from 'types';

import { ALL_OPTION_VALUE, useFilterOptions } from './hooks/useFilterOptions';

const optionClassName = cn('px-3 h-10 scrollbar-track-cards');

interface VaultsProps extends HTMLAttributes<HTMLDivElement> {
  vaults: Vault[];
}

export const Vaults: FC<VaultsProps> = ({ vaults, className, ...props }) => {
  const { t } = useTranslation();
  const {
    category: filterCategory,
    setCategory,
    categoryOptions,
    manager: filterManager,
    setManager,
    managerOptions,
    status: filterStatus,
    setStatus,
    statusOptions,
  } = useFilterOptions();

  const [search, setSearch] = useState('');
  const onChange: TextFieldProps['onChange'] = e => {
    setSearch(e.currentTarget?.value);
  };

  const filteredVaults = (vaults ?? []).filter(vault => {
    return (
      (filterCategory === ALL_OPTION_VALUE || filterCategory === vault.category) &&
      (filterManager === ALL_OPTION_VALUE || filterManager === vault.manager) &&
      (filterStatus === ALL_OPTION_VALUE || filterStatus === vault.status) &&
      (!search || vault.stakedToken.symbol?.toLowerCase().includes(search?.toLowerCase()))
    );
  });

  return (
    <div>
      <div className="text-light-grey-active mb-3 text-p2s">{t('vault.filter.vaults')}</div>
      <div className={cn('flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3')}>
        <div className="grid grid-cols-2 sm:flex gap-3 w-full">
          <Select
            className="sm:flex-1/3 lg:flex-none"
            size="medium"
            placeLabelToLeft
            options={categoryOptions}
            optionClassName={optionClassName}
            buttonClassName="sm:min-w-45"
            value={filterCategory}
            onChange={newValue => setCategory(newValue.toString())}
          />
          <Select
            className="sm:flex-1/3 lg:flex-none"
            size="medium"
            placeLabelToLeft
            options={managerOptions}
            optionClassName={optionClassName}
            buttonClassName="sm:min-w-45"
            value={filterManager}
            onChange={newValue => setManager(newValue.toString())}
          />
          <Select
            className="sm:flex-1/3 lg:flex-none"
            size="medium"
            placeLabelToLeft
            options={statusOptions}
            optionClassName={optionClassName}
            buttonClassName="sm:min-w-45"
            value={filterStatus}
            onChange={newValue => setStatus(newValue.toString())}
          />
        </div>
        <TextField
          value={search}
          onChange={onChange}
          size="sm"
          leftIconSrc="magnifier"
          placeholder={t('vault.filter.inputPlaceholder')}
          className="w-full lg:w-75"
        />
      </div>
      <div className={cn('grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6', className)} {...props}>
        {filteredVaults.map(vault => (
          <VaultCard vault={vault} key={vault.key} />
        ))}
      </div>
    </div>
  );
};
