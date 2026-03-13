import { Select, TextField, type TextFieldProps, cn } from 'components';
import type { ActiveModal } from 'containers/Vault';
import { VaultCardLegacy } from 'containers/Vault/VaultCard/Legacy';
import { useTranslation } from 'libs/translations';
import { type FC, type HTMLAttributes, useState } from 'react';
import type { Vault } from 'types';
import { generateVaultKey, getVaultMetadata } from '../utils';
import { ALL_OPTION_VALUE, useFilterOptions } from './hooks/useFilterOptions';

interface VaultsProps extends HTMLAttributes<HTMLDivElement> {
  vaults: Vault[];
  openModal: (vault: Vault, activeModal?: ActiveModal) => void;
}

export const Vaults: FC<VaultsProps> = ({ vaults, openModal, className, ...props }) => {
  const { t } = useTranslation();
  const { category, setCategory, categoryOptions, curator, setCurator, curatorOptions } =
    useFilterOptions();

  const [search, setSearch] = useState('');
  const onChange: TextFieldProps['onChange'] = e => {
    setSearch(e.currentTarget?.value);
  };

  const filteredVaults = (vaults ?? []).filter(vault => {
    const { category: _category, curator: _curator } = getVaultMetadata(vault);

    return (
      (category === ALL_OPTION_VALUE || category === _category) &&
      (curator === ALL_OPTION_VALUE || curator === _curator) &&
      (!search ||
        vault.stakedToken.symbol?.toLowerCase().includes(search?.toLowerCase()) ||
        _curator?.toLowerCase().includes(search?.toLowerCase()))
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
            variant="tertiary"
            placeLabelToLeft
            options={categoryOptions}
            optionClassName="px-3 h-10 scrollbar-track-cards"
            dropdownClassName="overflow-auto max-h-70 scrollbar-thin scrollbar-track-cards scrollbar-thumb-grey"
            buttonClassName="sm:min-w-45"
            value={category}
            onChange={newValue => setCategory(newValue.toString())}
          />
          <Select
            className="sm:flex-1/3 lg:flex-none"
            size="medium"
            variant="tertiary"
            placeLabelToLeft
            options={curatorOptions}
            optionClassName="px-3 h-10 scrollbar-track-cards"
            dropdownClassName="overflow-y-auto max-h-70 scrollbar-thin scrollbar-track-cards scrollbar-thumb-grey"
            buttonClassName="sm:min-w-45"
            value={curator}
            onChange={newValue => setCurator(newValue.toString())}
          />
        </div>
        <TextField
          value={search}
          onChange={onChange}
          size="sm"
          leftIconSrc="search"
          placeholder={t('vault.filter.inputPlaceholder')}
          className="w-full lg:w-80"
        />
      </div>
      <div className={cn('grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6', className)} {...props}>
        {filteredVaults.map(vault => (
          <VaultCardLegacy vault={vault} key={generateVaultKey(vault)} openModal={openModal} />
        ))}
      </div>
    </div>
  );
};
