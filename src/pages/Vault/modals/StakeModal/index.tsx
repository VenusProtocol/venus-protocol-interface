/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';

import { AuthContext } from 'context/AuthContext';
import { getToken } from 'utilities';
import { useTranslation } from 'translation';
import { useGetBalanceOf } from 'clients/api';
import ActionModal, { IActionModalProps } from '../ActionModal';

export type StakeModalProps = Pick<IActionModalProps, 'tokenId' | 'handleClose'>;

const StakeModal: React.FC<StakeModalProps> = ({ tokenId, handleClose }) => {
  const { t } = useTranslation();
  const { account } = useContext(AuthContext);
  const tokenSymbol = getToken(tokenId).symbol;

  const { data: availableTokensWei = new BigNumber(0), isLoading: isGetWalletBalanceWeiLoading } =
    useGetBalanceOf(
      {
        accountAddress: account?.address || '',
        tokenId,
      },
      {
        enabled: !!account?.address,
      },
    );

  // TODO: wire up
  const onSubmit = () => {};
  const isSubmitting = false;

  return (
    <ActionModal
      title={t('stakeModal.title', { tokenSymbol })}
      tokenId={tokenId}
      handleClose={handleClose}
      availableTokensWei={availableTokensWei}
      isInitialLoading={isGetWalletBalanceWeiLoading}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      connectWalletMessage={t('stakeModal.connectWalletMessage', { tokenSymbol })}
      tokenNeedsToBeEnabled
      enableTokenMessage={t('stakeModal.enableTokenMessage', { tokenSymbol })}
      availableTokensLabel={t('stakeModal.availableTokensLabel', { tokenSymbol })}
      submitButtonLabel={t('stakeModal.submitButtonLabel')}
      submitButtonDisabledLabel={t('stakeModal.submitButtonDisabledLabel')}
    />
  );
};

export default StakeModal;
