import { cn } from '@venusprotocol/ui';

import { TokenIcon } from 'components/TokenIcon';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import type { Vault } from 'types';
import { getVaultCategoryName } from 'utilities/getVaultCategoryName';

export interface VaultNameProps {
  vault: Vault;
  className?: string;
}

export const VaultName: React.FC<VaultNameProps> = ({ vault, className }) => {
  const { t } = useTranslation();
  const now = useNow();

  let description: undefined | string;

  if ('maturityDate' in vault) {
    const remainingDays = Math.ceil(
      (vault.maturityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    description = t('vault.card.header.maturityDate', {
      date: vault.maturityDate,
      count: remainingDays,
    });
  } else {
    description = getVaultCategoryName({
      category: vault.category,
      t,
    });
  }

  return (
    <div className={cn('flex min-w-0 items-center', 'gap-x-3', className)}>
      <TokenIcon token={vault.stakedToken} className="shrink-0" size="xl" />

      <div className="min-w-0">
        <p className="truncate text-b1s">{vault.stakedToken.symbol}</p>

        {!!description && <p className="truncate text-light-grey text-b2r">{description}</p>}
      </div>
    </div>
  );
};
