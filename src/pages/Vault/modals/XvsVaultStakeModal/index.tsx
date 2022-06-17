/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { getToken } from 'utilities';
import { useTranslation } from 'translation';
import ActionModal, { IActionModalProps } from '../ActionModal';

export type XvsVaultStakeModalProps = Pick<IActionModalProps, 'tokenId' | 'handleClose'>;

const XvsVaultStakeModal: React.FC<XvsVaultStakeModalProps> = ({ tokenId, handleClose }) => {
  const { t } = useTranslation();
  const tokenSymbol = getToken(tokenId).symbol;

  // TODO: wire up
  const availableTokensWei = new BigNumber('193871256231321312312');
  const isInitialLoading = true;
  const onSubmit = () => {};
  const isSubmitting = true;

  return (
    <ActionModal
      title={t('XvsVaultStakeModal.title', { tokenSymbol })}
      tokenId={tokenId}
      handleClose={handleClose}
      availableTokensWei={availableTokensWei}
      isInitialLoading={isInitialLoading}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      connectWalletMessage={t('XvsVaultStakeModal.connectWalletMessage', { tokenSymbol })}
      tokenNeedsToBeEnabled
      enableTokenMessage={t('XvsVaultStakeModal.enableTokenMessage', { tokenSymbol })}
      availableTokensLabel={t('XvsVaultStakeModal.availableTokensLabel', { tokenSymbol })}
      submitButtonLabel={t('XvsVaultStakeModal.submitButtonLabel')}
      submitButtonDisabledLabel={t('XvsVaultStakeModal.submitButtonDisabledLabel')}
    />
  );
};

export default XvsVaultStakeModal;
