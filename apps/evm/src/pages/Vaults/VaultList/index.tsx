import { InfoIcon, MultiSelect, TextField, type TextFieldProps, Toggle, cn } from 'components';
import { VaultCard } from 'containers/VaultCard';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import { type FC, type HTMLAttributes, useId, useState } from 'react';
import type { Vault } from 'types';

import { NoResults } from './NoResults';
import { useFilterOptions } from './hooks/useFilterOptions';
import { isVaultArchived } from './isVaultArchived';

const multiSelectClassName = 'sm:flex-1/3 sm:min-w-45 xl:flex-none';

interface VaultListProps extends HTMLAttributes<HTMLDivElement> {
  vaults: Vault[];
  dataUpdatedAt: number;
  isUserDataUnavailable?: boolean;
}

export const VaultList: FC<VaultListProps> = ({
  vaults,
  dataUpdatedAt,
  isUserDataUnavailable = false,
  className,
  ...props
}) => {
  const { t } = useTranslation();
  const {
    categories: filterCategories,
    setCategories,
    categoryOptions,
    venues: filterVenues,
    setVenues,
    venueOptions,
    statuses: filterStatuses,
    setStatuses,
    statusOptions,
    reset: resetFilters,
  } = useFilterOptions();

  const [{ showArchivedVaults }, setUserChainSettings] = useUserChainSettings();
  const archivedVaultsToggleLabelId = useId();

  const [search, setSearch] = useState('');
  const onChange: TextFieldProps['onChange'] = e => {
    setSearch(e.currentTarget?.value);
  };

  const handleResetAll = () => {
    resetFilters();
    setSearch('');
  };

  // An empty group means no constraint: values are OR-ed within a group, and groups are
  // AND-ed together
  const filteredVaults = (vaults ?? []).filter(vault => {
    return (
      (filterCategories.length === 0 || filterCategories.includes(vault.category)) &&
      (filterVenues.length === 0 || filterVenues.includes(vault.venue)) &&
      (filterStatuses.length === 0 || filterStatuses.includes(vault.status)) &&
      (showArchivedVaults ||
        !isVaultArchived({ vault, nowMs: dataUpdatedAt, isUserDataUnavailable })) &&
      (!search || vault.stakedToken.symbol?.toLowerCase().includes(search?.toLowerCase()))
    );
  });

  return (
    <div className="flex flex-col">
      <div className="pb-6">
        <div className="mb-3">
          <h1 className="text-p1s sm:text-h6">{t('vault.header')}</h1>
          <p className="text-1br">{t('vault.description')}</p>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center gap-3">
          <TextField
            value={search}
            onChange={onChange}
            size="sm"
            leftIconSrc="magnifier"
            placeholder={t('vault.filter.inputPlaceholder')}
            className="w-full xl:w-75"
          />

          <div className="grid grid-cols-2 sm:flex gap-3 w-full xl:w-fit">
            <MultiSelect
              className={multiSelectClassName}
              options={categoryOptions}
              value={filterCategories}
              onChange={setCategories}
              placeholder={t('vault.filter.allCategories')}
              renderCount={count => t('vault.filter.nCategories', { count })}
              title={t('vault.filter.selectCategories')}
              resetLabel={t('vault.filter.reset')}
            />
            <MultiSelect
              className={multiSelectClassName}
              options={venueOptions}
              value={filterVenues}
              onChange={setVenues}
              placeholder={t('vault.filter.allVenues')}
              renderCount={count => t('vault.filter.nVenues', { count })}
              title={t('vault.filter.selectVenues')}
              resetLabel={t('vault.filter.reset')}
            />
            <MultiSelect
              className={multiSelectClassName}
              options={statusOptions}
              value={filterStatuses}
              onChange={setStatuses}
              placeholder={t('vault.filter.allStates')}
              renderCount={count => t('vault.filter.nStates', { count })}
              title={t('vault.filter.selectStates')}
              resetLabel={t('vault.filter.reset')}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:ml-auto">
            <span id={archivedVaultsToggleLabelId} className="text-b1r whitespace-nowrap">
              {t('vault.filter.archivedVaultsToggle.label')}
            </span>

            <InfoIcon tooltip={t('vault.filter.archivedVaultsToggle.tooltip')} />

            <Toggle
              aria-labelledby={archivedVaultsToggleLabelId}
              value={showArchivedVaults}
              onChange={() => setUserChainSettings({ showArchivedVaults: !showArchivedVaults })}
            />
          </div>
        </div>
      </div>

      {filteredVaults.length === 0 ? (
        <NoResults onReset={handleResetAll} />
      ) : (
        <div className={cn('relative grid grid-cols-1 xl:grid-cols-3 gap-3', className)} {...props}>
          {filteredVaults.map(vault => (
            <VaultCard vault={vault} key={vault.key} />
          ))}
        </div>
      )}
    </div>
  );
};
