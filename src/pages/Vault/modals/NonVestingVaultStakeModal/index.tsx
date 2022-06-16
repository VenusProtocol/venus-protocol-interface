/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { getToken } from 'utilities';
import { useTranslation } from 'translation';
import ActionModal, { IActionModalProps } from '../ActionModal';

export type NonVestingVaultStakeModalProps = Pick<IActionModalProps, 'tokenId' | 'handleClose'>;

const NonVestingVaultStakeModal: React.FC<NonVestingVaultStakeModalProps> = ({
  tokenId,
  handleClose,
}) => {
  const { t } = useTranslation();
  const tokenSymbol = getToken(tokenId).symbol;

  // TODO: wire up
  const availableTokensWei = new BigNumber('193871256231321312312');
  const isInitialLoading = true;
  const onSubmit = () => {};
  const isSubmitting = true;

  return (
    <ActionModal
      title={t('nonVestingVaultStakeModal.title', { tokenSymbol })}
      tokenId={tokenId}
      handleClose={handleClose}
      availableTokensWei={availableTokensWei}
      isInitialLoading={isInitialLoading}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      connectWalletMessage={t('nonVestingVaultStakeModal.connectWalletMessage', { tokenSymbol })}
      tokenNeedsToBeEnabled
      enableTokenMessage={t('nonVestingVaultStakeModal.enableTokenMessage', { tokenSymbol })}
      availableTokensLabel={t('nonVestingVaultStakeModal.availableTokensLabel', { tokenSymbol })}
      submitButtonLabel={t('nonVestingVaultStakeModal.submitButtonLabel')}
      submitButtonDisabledLabel={t('nonVestingVaultStakeModal.submitButtonDisabledLabel')}
    />
  );
};

export default NonVestingVaultStakeModal;
