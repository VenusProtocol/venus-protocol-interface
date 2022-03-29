import React from 'react';

import { Modal, IModalProps } from '../Modal';
import { AccountDetails, IAccountDetailsProps } from './AccountDetails';
import { WalletList, IWalletListProps } from './WalletList';

export interface IAuthModalProps {
  isOpen: boolean;
  onClose: IModalProps['handleClose'];
  onLogin: IWalletListProps['onLogin'];
  onLogOut: IAccountDetailsProps['onLogOut'];
  onCopyAccountAddress: IAccountDetailsProps['onCopyAccountAddress'];
  account?: IAccountDetailsProps['account'];
}

export const AuthModal: React.FC<IAuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onLogOut,
  onCopyAccountAddress,
  account,
}) => (
  <Modal
    className="venus-modal"
    isOpened={isOpen}
    handleClose={onClose}
    noHorizontalPadding={!account}
    title={<h4>{!account ? 'Connect a wallet to start using Venus' : 'Your wallet'}</h4>}
  >
    {!account ? (
      <WalletList onLogin={onLogin} />
    ) : (
      <AccountDetails
        account={account}
        onCopyAccountAddress={onCopyAccountAddress}
        onLogOut={onLogOut}
      />
    )}
  </Modal>
);
