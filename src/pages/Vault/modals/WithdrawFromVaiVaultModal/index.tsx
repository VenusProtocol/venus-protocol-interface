/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';

import { useGetVaiVaultUserInfo, useWithdrawFromVaiVault } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

import ActionModal, { ActionModalProps } from '../ActionModal';

export type WithdrawFromVaiVaultModalProps = Pick<ActionModalProps, 'handleClose'>;

const WithdrawFromVaiVaultModal: React.FC<WithdrawFromVaiVaultModalProps> = ({ handleClose }) => {
  const { t } = useTranslation();
  const { account } = useContext(AuthContext);

  const { data: vaiVaultUserInfo, isLoading: isGetVaiVaultUserInfoLoading } =
    useGetVaiVaultUserInfo(
      {
        accountAddress: account?.address || '',
      },
      {
        enabled: !!account?.address,
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
      title={t('withdrawFromVaiVaultModal.title', { tokenSymbol: TOKENS.vai.symbol })}
      token={TOKENS.vai}
      handleClose={handleClose}
      availableTokensWei={vaiVaultUserInfo?.stakedVaiWei || new BigNumber(0)}
      isInitialLoading={isGetVaiVaultUserInfoLoading}
      onSubmit={handleWithdraw}
      isSubmitting={isWithdrawLoading}
      connectWalletMessage={t('withdrawFromVaiVaultModal.connectWalletMessage', {
        tokenSymbol: TOKENS.vai.symbol,
      })}
      availableTokensLabel={t('withdrawFromVaiVaultModal.availableTokensLabel', {
        tokenSymbol: TOKENS.vai.symbol,
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
