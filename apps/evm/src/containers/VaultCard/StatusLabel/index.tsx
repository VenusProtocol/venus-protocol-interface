import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';
import type { FC, HTMLAttributes } from 'react';
import { VaultStatus } from 'types';

export interface StatusLabelProps extends HTMLAttributes<HTMLDivElement> {
  status: VaultStatus;
  size?: 'md';
}

export const StatusLabel: FC<StatusLabelProps> = ({ status, className, children, ...props }) => {
  const { t } = useTranslation();

  let variantClassName = '';

  switch (status) {
    case VaultStatus.Claim:
    case VaultStatus.Earning:
      variantClassName = cn('border-green bg-green/10');
      break;
    case VaultStatus.Refund:
      variantClassName = cn('border-yellow bg-yellow/10');
      break;
    case VaultStatus.Deposit:
    case VaultStatus.Active:
      variantClassName = cn('border-blue bg-blue/10');
      break;
    default:
      variantClassName = cn('border-dark-grey-hover bg-dark-grey');
  }

  let label = '';

  switch (status) {
    case VaultStatus.Claim:
      label = t('vault.filter.claim');
      break;
    case VaultStatus.Refund:
      label = t('vault.filter.refund');
      break;
    case VaultStatus.Deposit:
      label = t('vault.filter.deposit');
      break;
    case VaultStatus.Active:
      label = t('vault.filter.active');
      break;
    case VaultStatus.Earning:
      label = t('vault.filter.earning');
      break;
    case VaultStatus.Paused:
      label = t('vault.filter.paused');
      break;
    case VaultStatus.Pending:
      label = t('vault.filter.pending');
      break;
    case VaultStatus.Repaying:
      label = t('vault.filter.repaying');
      break;
    case VaultStatus.Inactive:
      label = t('vault.filter.inactive');
      break;
    case VaultStatus.Liquidated:
      label = t('vault.filter.liquidated');
      break;
  }

  return (
    <div
      className={cn(
        'flex justify-center items-center border border-solid rounded-full py-1 px-3 text-light-grey-active text-b1r',
        variantClassName,
        className,
      )}
      {...props}
    >
      {label}
    </div>
  );
};
