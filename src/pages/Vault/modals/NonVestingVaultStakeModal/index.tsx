/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { Modal, IModalProps, Spinner } from 'components';
import TransactionForm, { ITransactionFormProps } from '../../TransactionForm';

export interface INonVestingVaultStakeModalUiProps
  extends Pick<IModalProps, 'handleClose'>,
    Pick<ITransactionFormProps, 'tokenId' | 'availableTokensWei' | 'onSubmit' | 'isSubmitting'> {
  isInitialLoading: boolean;
}

const NonVestingVaultStakeModalUi: React.FC<INonVestingVaultStakeModalUiProps> = ({
  handleClose,
  tokenId,
  isInitialLoading,
  availableTokensWei,
  onSubmit,
  isSubmitting,
}) => {
  // TODO: internationalize and update content
  const title = 'Title';
  const availableTokensLabel = 'Available VAI';
  const submitButtonLabel = 'Stake';
  const submitButtonDisabledLabel = 'Enter a valid amount to stake';

  return (
    <Modal isOpen title={title} handleClose={handleClose}>
      {isInitialLoading ? (
        <Spinner />
      ) : (
        // TODO: wrap with EnableToken
        <TransactionForm
          tokenId={tokenId}
          availableTokensWei={availableTokensWei}
          availableTokensLabel={availableTokensLabel}
          submitButtonLabel={submitButtonLabel}
          submitButtonDisabledLabel={submitButtonDisabledLabel}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  );
};

export type NonVestingVaultStakeModalProps = Pick<
  INonVestingVaultStakeModalUiProps,
  'tokenId' | 'handleClose'
>;

const NonVestingVaultStakeModal: React.FC<NonVestingVaultStakeModalProps> = ({
  tokenId,
  handleClose,
}) => {
  // TODO: wire up
  const availableTokensWei = new BigNumber('193871256231321312312');
  const isInitialLoading = true;
  const onSubmit = () => {};
  const isSubmitting = true;

  return (
    <NonVestingVaultStakeModalUi
      handleClose={handleClose}
      tokenId={tokenId}
      availableTokensWei={availableTokensWei}
      isInitialLoading={isInitialLoading}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default NonVestingVaultStakeModal;
