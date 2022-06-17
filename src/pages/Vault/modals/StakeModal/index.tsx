/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { getToken } from 'utilities';
import { useTranslation } from 'translation';
import ActionModal, { IActionModalProps } from '../ActionModal';

export type StakeModalProps = Pick<IActionModalProps, 'tokenId' | 'handleClose'>;

const StakeModal: React.FC<StakeModalProps> = ({ tokenId, handleClose }) => {
  const { t } = useTranslation();
  const tokenSymbol = getToken(tokenId).symbol;

  // TODO: wire up
  const availableTokensWei = new BigNumber('193871256231321312312');
  const isInitialLoading = true;
  const onSubmit = () => {};
  const isSubmitting = true;

  return (
    <ActionModal
      title={t('stakeModal.title', { tokenSymbol })}
      tokenId={tokenId}
      handleClose={handleClose}
      availableTokensWei={availableTokensWei}
      isInitialLoading={isInitialLoading}
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
