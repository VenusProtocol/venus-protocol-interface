import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet/hooks/useAccountAddress';
import { useAuthModal } from 'libs/wallet/hooks/useAuthModal';
import { useChainId } from 'libs/wallet/hooks/useChainId';
import { useLogIn } from 'libs/wallet/hooks/useLogIn';
import { useLogOut } from 'libs/wallet/hooks/useLogOut';

import { Modal } from 'components/Modal';

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
