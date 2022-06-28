/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';

import { TOKENS } from 'constants/tokens';
import { TokenId } from 'types';
import { AuthContext } from 'context/AuthContext';
import { getToken } from 'utilities';
import { useTranslation } from 'translation';
import { useGetVaiVaultUserInfo, useWithdrawFromVaiVault } from 'clients/api';
import ActionModal, { IActionModalProps } from '../ActionModal';

export type WithdrawFromVaiVaultModalProps = Pick<IActionModalProps, 'handleClose'>;

const VAI_ID = TOKENS.vai.id as TokenId;

const WithdrawFromVaiVaultModal: React.FC<WithdrawFromVaiVaultModalProps> = ({ handleClose }) => {
  const { t } = useTranslation();
  const { account } = useContext(AuthContext);
  const vaiSymbol = getToken(VAI_ID).symbol;

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
      // account.address has to exist at this point since users are prompted to
      // connect their wallet before they're able to withdraw
      fromAccountAddress: account?.address || '',
    });

    // Close modal
    handleClose();

    return res;
  };

  return (
    <ActionModal
      title={t('withdrawFromVaiVaultModal.title', { tokenSymbol: vaiSymbol })}
      tokenId={VAI_ID}
      handleClose={handleClose}
      availableTokensWei={vaiVaultUserInfo?.stakedVaiWei || new BigNumber(0)}
      isInitialLoading={isGetVaiVaultUserInfoLoading}
      onSubmit={handleWithdraw}
      isSubmitting={isWithdrawLoading}
      connectWalletMessage={t('withdrawFromVaiVaultModal.connectWalletMessage', {
        tokenSymbol: vaiSymbol,
      })}
      availableTokensLabel={t('withdrawFromVaiVaultModal.availableTokensLabel', {
        tokenSymbol: vaiSymbol,
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
