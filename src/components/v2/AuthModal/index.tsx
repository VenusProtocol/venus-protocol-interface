import React from 'react';
import { Modal } from 'antd';

import { AccountDetails, IAccountDetailsProps } from './AccountDetails';
import { WalletList, IWalletListProps } from './WalletList';

export interface IAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: IWalletListProps['onLogin'];
  onLogOut: IAccountDetailsProps['onLogOut'];
  onCopyAccount: IAccountDetailsProps['onCopyAccount'];
  account?: IAccountDetailsProps['account'];
}

export const AuthModal: React.FC<IAuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onLogOut,
  onCopyAccount,
  account,
}) => (
  // TODO: refactor to use new Modal component
  <Modal
    className="venus-modal"
    width={532}
    visible={isOpen}
    onCancel={onClose}
    footer={null}
    closable={false}
    maskClosable
    centered
  >
    {!account ? (
      <WalletList onLogin={onLogin} />
    ) : (
      <AccountDetails account={account} onCopyAccount={onCopyAccount} onLogOut={onLogOut} />
    )}
  </Modal>
);
