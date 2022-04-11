import React from 'react';

import { useTranslation } from 'translation';
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
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      className="venus-modal"
      isOpened={isOpen}
      handleClose={onClose}
      noHorizontalPadding={!account}
      title={
        <h4>{!account ? t('authModal.title.connectWallet') : t('authModal.title.yourWallet')}</h4>
      }
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
};
