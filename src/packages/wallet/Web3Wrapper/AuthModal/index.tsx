import React from 'react';

import { Modal } from 'components/Modal';
import { useTranslation } from 'packages/translations';
import { useAccountAddress } from 'packages/wallet/hooks/useAccountAddress';
import { useAuthModal } from 'packages/wallet/hooks/useAuthModal';
import { useChainId } from 'packages/wallet/hooks/useChainId';
import { useLogIn } from 'packages/wallet/hooks/useLogIn';
import { useLogOut } from 'packages/wallet/hooks/useLogOut';

import { AccountDetails } from './AccountDetails';
import { WalletList, WalletListProps } from './WalletList';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuthModal();
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();
  const { logOut } = useLogOut();
  const { logIn } = useLogIn();
  const { t } = useTranslation();

  const handleLogIn: WalletListProps['onLogIn'] = connector => {
    closeAuthModal();
    return logIn(connector);
  };

  return (
    <Modal
      className="venus-modal"
      isOpen={isAuthModalOpen}
      handleClose={closeAuthModal}
      noHorizontalPadding={!accountAddress}
      title={
        <h4>
          {!accountAddress ? t('authModal.title.connectWallet') : t('authModal.title.yourAccount')}
        </h4>
      }
    >
      {!accountAddress ? (
        <WalletList onLogIn={handleLogIn} />
      ) : (
        <AccountDetails accountAddress={accountAddress} onLogOut={logOut} chainId={chainId} />
      )}
    </Modal>
  );
};
