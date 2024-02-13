/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';

import { useGetVaiVaultUserInfo, useWithdrawFromVaiVault } from 'clients/api';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';

import ActionModal, { ActionModalProps } from '../ActionModal';

export type WithdrawFromVaiVaultModalProps = Pick<ActionModalProps, 'handleClose'>;

const WithdrawFromVaiVaultModal: React.FC<WithdrawFromVaiVaultModalProps> = ({ handleClose }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { data: vaiVaultUserInfo, isLoading: isGetVaiVaultUserInfoLoading } =
    useGetVaiVaultUserInfo(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { mutateAsync: withdraw, isLoading: isWithdrawLoading } = useWithdrawFromVaiVault();

  const handleWithdraw = async (amountMantissa: BigNumber) => {
    // Send request to withdraw
    const res = await withdraw({
      amountMantissa,
    });

    // Close modal
    handleClose();

    return res;
  };

  return (
    <ActionModal
      title={t('withdrawFromVaiVaultModal.title', { tokenSymbol: vai?.symbol })}
      token={vai!}
      handleClose={handleClose}
      availableTokensMantissa={vaiVaultUserInfo?.stakedVaiMantissa || new BigNumber(0)}
      isInitialLoading={isGetVaiVaultUserInfoLoading}
      onSubmit={handleWithdraw}
      isSubmitting={isWithdrawLoading}
      connectWalletMessage={t('withdrawFromVaiVaultModal.connectWalletMessage', {
        tokenSymbol: vai?.symbol,
      })}
      availableTokensLabel={t('withdrawFromVaiVaultModal.availableTokensLabel', {
        tokenSymbol: vai?.symbol,
      })}
      submitButtonLabel={t('withdrawFromVaiVaultModal.submitButtonLabel')}
      submitButtonDisabledLabel={t('withdrawFromVaiVaultModal.submitButtonDisabledLabel')}
    />
  );
};

export default WithdrawFromVaiVaultModal;
