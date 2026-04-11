import BigNumber from 'bignumber.js';

import { useGetVaiVaultUserInfo, useWithdrawFromVaiVault } from 'clients/api';
import { Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { ConnectWallet } from 'containers/ConnectWallet';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import TransactionForm from '../../TransactionForm';

export interface WithdrawFromVaiVaultFormProps {
  onClose: () => void;
}

export const WithdrawFromVaiVaultForm: React.FC<WithdrawFromVaiVaultFormProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { data: vaiVaultUserInfo, isLoading: isGetVaiVaultUserInfoLoading } =
    useGetVaiVaultUserInfo(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { mutateAsync: withdraw, isPending: isWithdrawLoading } = useWithdrawFromVaiVault();

  const handleWithdraw = async (amountMantissa: BigNumber) => {
    // Send request to withdraw
    const res = await withdraw({
      amountMantissa: BigInt(amountMantissa.toFixed()),
    });

    // Close modal
    onClose();

    return res;
  };

  return (
    <ConnectWallet
      message={t('withdrawFromVaiVaultModalForm.connectWalletMessage', {
        tokenSymbol: vai?.symbol,
      })}
      analyticVariant="vault_withdraw_modal"
    >
      {isGetVaiVaultUserInfoLoading || !vai ? (
        <Spinner />
      ) : (
        <TransactionForm
          token={vai}
          availableTokensMantissa={vaiVaultUserInfo?.stakedVaiMantissa || new BigNumber(0)}
          onSubmit={handleWithdraw}
          isSubmitting={isWithdrawLoading}
          availableTokensLabel={t('withdrawFromVaiVaultModalForm.availableTokensLabel', {
            tokenSymbol: vai?.symbol,
          })}
          submitButtonLabel={t('withdrawFromVaiVaultModalForm.submitButtonLabel')}
          submitButtonDisabledLabel={t('withdrawFromVaiVaultModalForm.submitButtonDisabledLabel')}
        />
      )}
    </ConnectWallet>
  );
};
