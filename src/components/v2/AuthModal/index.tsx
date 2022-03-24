import React from 'react';
import { Modal } from 'antd';

import { AccountDetails, IAccountDetailsProps } from './AccountDetails';
import { WalletList, IWalletListProps } from './WalletList';

export interface IAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  // TODO: refactor to use new Modal component
  <Modal
    className="venus-modal"
    width={580}
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
      <AccountDetails
        account={account}
        onCopyAccountAddress={onCopyAccountAddress}
        onLogOut={onLogOut}
      />
    )}
  </Modal>
);
