import { Icon, Select, Tooltip, cn } from 'components';
import { type ActiveModal, VaultCard } from 'containers/Vault';
import { useTranslation } from 'libs/translations';
import type { FC, HTMLAttributes } from 'react';
import type { Vault } from 'types';
import { useFilterOptions } from './hooks/useFilterOptions';
import { generateVaultKey } from './utils';

interface VaultsProps extends HTMLAttributes<HTMLDivElement> {
  vaults: Vault[];
  openModal: (vault: Vault, activeModal: ActiveModal) => void;
}

export const Vaults: FC<VaultsProps> = ({ vaults, openModal, className, ...props }) => {
  const { t } = useTranslation();
  const {
    category,
    setCategory,
    categoryOptions,
    curator,
    setCurator,
    curatorOptions,
    status,
    setStatus,
    statusOptions,
  } = useFilterOptions();

  return (
    <>
      <div className="flex items-center gap-2 text-light-grey-active mb-3 text-p2s">
        {t('vault.filter.vaults')}
        <Tooltip content={t('vault.filter.titleTooltip')}>
          <Icon name="info" className="text-light-grey" />
        </Tooltip>
      </div>
      <div className={cn('flex items-center justify-between')}>
        <div className="flex gap-3 max-sm:flex-wrap">
          <Select
            className="flex-1 md:flex-none"
            size="small"
            variant="tertiary"
            placeLabelToLeft
            options={categoryOptions}
            optionClassName="px-3 h-10 scrollbar-track-cards"
            dropdownClassName="overflow-auto max-h-70 scrollbar-thin scrollbar-track-cards scrollbar-thumb-grey"
            buttonClassName="min-w-45"
            value={category}
            onChange={newValue => setCategory(newValue.toString())}
          />
          <Select
            className="flex-1 md:flex-none"
            size="small"
            variant="tertiary"
            placeLabelToLeft
            options={curatorOptions}
            optionClassName="px-3 h-10 scrollbar-track-cards"
            dropdownClassName="overflow-y-auto max-h-70 scrollbar-thin scrollbar-track-cards scrollbar-thumb-grey"
            buttonClassName="min-w-45"
            value={curator}
            onChange={newValue => setCurator(newValue.toString())}
          />
          <Select
            className="flex-1 md:flex-none"
            size="small"
            variant="tertiary"
            placeLabelToLeft
            options={statusOptions}
            optionClassName="px-3 h-10 scrollbar-track-cards"
            dropdownClassName="overflow-y-auto max-h-70 scrollbar-thin scrollbar-track-cards scrollbar-thumb-grey"
            buttonClassName="min-w-45"
            value={status}
            onChange={newValue => setStatus(newValue.toString())}
          />
        </div>
        <input />
      </div>
      <div className={cn('grid grid-cols-1 xl:grid-cols-2 gap-6', className)} {...props}>
        {(vaults ?? []).map(vault => (
          <VaultCard
            vault={vault}
            key={generateVaultKey(vault)}
            onStake={() => openModal(vault, 'stake')}
            onWithdraw={() => openModal(vault, 'withdraw')}
          />
        ))}
      </div>
    </>
  );
};
