import { useRedeemFromInstitutionalVault, useWithdrawFromInstitutionalVault } from 'clients/api';
import { NoticeInfo, PrimaryButton } from 'components';
import { SwitchChain } from 'containers/SwitchChain';
import { VError, handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { type InstitutionalVault, VaultStatus } from 'types';
import { Footer } from '../Footer';
import { getExitAmountMantissa } from './getExitAmountMantissa';

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
  const claimAmountMantissa = getExitAmountMantissa({
    primaryAmountMantissa: vault.userRedeemLimitMantissa,
    fallbackAmountMantissa: vault.userStakeBalanceMantissa,
    status: vault.status,
    requiredStatus: VaultStatus.Claim,
  });
  const refundAmountMantissa = getExitAmountMantissa({
    primaryAmountMantissa: vault.userWithdrawLimitMantissa,
    fallbackAmountMantissa: vault.userStakeBalanceMantissa,
    status: vault.status,
    requiredStatus: VaultStatus.Refund,
  });
  const canClaim = claimAmountMantissa.gt(0);
  const canRefund = refundAmountMantissa.gt(0);

  const handleClick = async () => {
    try {
      if (!canClaim && !canRefund) {
        throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
      }

      if (canRefund) {
        await withdraw({
          amountMantissa: refundAmountMantissa,
        });

        onClose();
        return;
      }

      await redeem({
        amountMantissa: claimAmountMantissa,
      });

      onClose();
    } catch (error) {
      handleError({ error });
    }
  };

  const isClaim = vault.status === VaultStatus.Claim;
  const isRefund = vault.status === VaultStatus.Refund;
  const isLiquidated = vault.status === VaultStatus.Liquidated;

  const isDisabled = !canRefund && !canClaim;

  return (
    <div className="space-y-4">
      <Footer vault={vault} />

      {isClaim || isRefund || isLiquidated ? (
        <SwitchChain>
          <PrimaryButton
            className="w-full"
            onClick={handleClick}
            loading={isRedeemLoading || isWithdrawLoading}
            disabled={isDisabled}
          >
            {isClaim ? t('vault.modals.claim') : t('vault.modals.withdraw')}
          </PrimaryButton>
        </SwitchChain>
      ) : (
        <NoticeInfo description={t('vault.modals.depositsPausedNotice')} />
      )}
    </div>
  );
};
