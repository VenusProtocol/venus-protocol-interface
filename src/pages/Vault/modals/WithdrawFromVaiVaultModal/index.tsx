/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useGetToken } from 'packages/tokens';
import React from 'react';
import { useTranslation } from 'translation';

import { useGetVaiVaultUserInfo, useWithdrawFromVaiVault } from 'clients/api';
import { useAuth } from 'context/AuthContext';

import ActionModal, { ActionModalProps } from '../ActionModal';

export type WithdrawFromVaiVaultModalProps = Pick<ActionModalProps, 'handleClose'>;

const WithdrawFromVaiVaultModal: React.FC<WithdrawFromVaiVaultModalProps> = ({ handleClose }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAuth();
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

  const handleWithdraw = async (amountWei: BigNumber) => {
    // Send request to withdraw
    const res = await withdraw({
      amountWei,
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
      availableTokensWei={vaiVaultUserInfo?.stakedVaiWei || new BigNumber(0)}
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
      successfulTransactionTitle={t('withdrawFromVaiVaultModal.successfulTransactionModal.title')}
      successfulTransactionDescription={t(
        'withdrawFromVaiVaultModal.successfulTransactionModal.description',
      )}
    />
  );
};

export default WithdrawFromVaiVaultModal;
