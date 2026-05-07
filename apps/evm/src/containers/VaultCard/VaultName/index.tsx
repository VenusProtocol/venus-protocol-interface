import { cn } from '@venusprotocol/ui';

import { TokenIcon } from 'components/TokenIcon';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { type Vault, VaultType } from 'types';
import { getVaultCategoryName } from 'utilities/getVaultCategoryName';

export interface VaultNameProps {
  vault: Vault;
  className?: string;
}

export const VaultName: React.FC<VaultNameProps> = ({ vault, className }) => {
  const { t } = useTranslation();
  const now = useNow();

  let description: undefined | string;

  if ('maturityDate' in vault && vault.maturityDate) {
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

  let title = vault.stakedToken.symbol;

  if (vault.vaultType === VaultType.Institutional) {
    title += ` - ${vault.manager.toUpperCase()}`;
  }

  return (
    <div className={cn('flex min-w-0 items-center', 'gap-x-3', className)}>
      <TokenIcon token={vault.stakedToken} className="shrink-0" size="xl" />

      <div className="min-w-0">
        <div className="flex items-center">
          <p className="truncate text-b1s">{title}</p>
        </div>

        {!!description && <p className="truncate text-light-grey text-b2r">{description}</p>}
      </div>
    </div>
  );
};
