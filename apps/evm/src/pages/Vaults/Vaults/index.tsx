import { Select, TextField, type TextFieldProps, cn } from 'components';
import { VaultCard } from 'containers/Vault/VaultCard';
import { VaultCardLegacy } from 'containers/Vault/VaultCard/Legacy';
import { useTranslation } from 'libs/translations';
import { type FC, type HTMLAttributes, useState } from 'react';
import type { Vault } from 'types';
import { generateVaultKey, getVaultMetadata } from '../utils';
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
    curator: filterCurator,
    setCurator,
    curatorOptions,
    status: filterStatus,
    setStatus,
    statusOptions,
  } = useFilterOptions();

  const [search, setSearch] = useState('');
  const onChange: TextFieldProps['onChange'] = e => {
    setSearch(e.currentTarget?.value);
  };

  const filteredVaults = (vaults ?? []).reduce(
    (accu, curr) => {
      const { category, curator, status } = getVaultMetadata(curr);
      if (
        (filterCategory === ALL_OPTION_VALUE || filterCategory === category) &&
        (filterCurator === ALL_OPTION_VALUE || filterCurator === curator) &&
        (filterStatus === ALL_OPTION_VALUE || filterStatus === status) &&
        (!search ||
          curr.stakedToken.symbol?.toLowerCase().includes(search?.toLowerCase()) ||
          curator?.toLowerCase().includes(search?.toLowerCase()))
      ) {
        accu.push({ ...curr, category, curator, status });
      }
      return accu;
    },
    [] as (Vault & { category: string; curator: string; status: string })[],
  );

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
            options={curatorOptions}
            optionClassName={optionClassName}
            buttonClassName="sm:min-w-45"
            value={filterCurator}
            onChange={newValue => setCurator(newValue.toString())}
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
        {filteredVaults.map(vault =>
          vault.curator === 'venus' ? (
            <VaultCardLegacy vault={vault} key={generateVaultKey(vault)} />
          ) : (
            <VaultCard vault={vault} key={generateVaultKey(vault)} />
          ),
        )}
      </div>
    </div>
  );
};
