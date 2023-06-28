import React from 'react';
import { useTranslation } from 'translation';

import { Modal, ModalProps } from '../Modal';
import { AccountDetails, AccountDetailsProps } from './AccountDetails';
import { WalletList, WalletListProps } from './WalletList';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: ModalProps['handleClose'];
  onLogin: WalletListProps['onLogin'];
  onLogOut: AccountDetailsProps['onLogOut'];
  onCopyAccountAddress: AccountDetailsProps['onCopyAccountAddress'];
  accountAddress?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onLogOut,
  onCopyAccountAddress,
  accountAddress,
}) => {
  const { t } = useTranslation();

  const handleLogin: WalletListProps['onLogin'] = connector => {
    onClose();
    return onLogin(connector);
  };

  return (
    <Modal
      className="venus-modal"
      isOpen={isOpen}
      handleClose={onClose}
      noHorizontalPadding={!accountAddress}
      title={
        <h4>
          {!accountAddress ? t('authModal.title.connectWallet') : t('authModal.title.yourAccount')}
        </h4>
      }
    >
      {!accountAddress ? (
        <WalletList onLogin={handleLogin} />
      ) : (
        <AccountDetails
          accountAddress={accountAddress}
          onCopyAccountAddress={onCopyAccountAddress}
          onLogOut={onLogOut}
        />
      )}
    </Modal>
  );
};
