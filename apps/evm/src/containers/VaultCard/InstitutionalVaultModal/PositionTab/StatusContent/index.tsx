import { useRedeemFromInstitutionalVault, useWithdrawFromInstitutionalVault } from 'clients/api';
import { NoticeInfo, PrimaryButton } from 'components';
import { useTranslation } from 'libs/translations';
import { type InstitutionalVault, VaultStatus } from 'types';
import { Footer } from '../Footer';

export interface StatusContentProps {
  vault: InstitutionalVault;
  onClose: () => void;
}

export const StatusContent: React.FC<StatusContentProps> = ({ vault, onClose }) => {
  const { t } = useTranslation();
  const { mutateAsync: redeem, isPending: isRedeemLoading } = useRedeemFromInstitutionalVault({
    vaultAddress: vault.vaultAddress,
  });
  const { mutateAsync: withdraw, isPending: isWithdrawLoading } = useWithdrawFromInstitutionalVault(
    {
      vaultAddress: vault.vaultAddress,
    },
  );

  const handleClaim = async () => {
    if (!vault.userRedeemLimitMantissa.gt(0)) {
      return;
    }

    await redeem({
      amountMantissa: vault.userRedeemLimitMantissa,
    });

    onClose();
  };

  const handleRefund = async () => {
    if (!vault.userWithdrawLimitMantissa.gt(0)) {
      return;
    }

    await withdraw({
      amountMantissa: vault.userWithdrawLimitMantissa,
    });

    onClose();
  };

  const isClaim = vault.status === VaultStatus.Claim;
  const isRefund = vault.status === VaultStatus.Refund;
  const isLiquidated = vault.status === VaultStatus.Liquidated;

  return (
    <div className="space-y-4">
      <Footer vault={vault} />

      {isClaim || isRefund || isLiquidated ? (
        <PrimaryButton
          className="w-full"
          onClick={isClaim ? handleClaim : handleRefund}
          loading={isRedeemLoading || isWithdrawLoading}
          disabled={
            isClaim ? !vault.userRedeemLimitMantissa.gt(0) : !vault.userWithdrawLimitMantissa.gt(0)
          }
        >
          {isClaim ? t('vault.modals.claim') : t('vault.modals.withdraw')}
        </PrimaryButton>
      ) : (
        <NoticeInfo description={t('vault.modals.depositsPausedNotice')} />
      )}
    </div>
  );
};
