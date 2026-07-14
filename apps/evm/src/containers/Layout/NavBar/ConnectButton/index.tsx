import { Button } from 'components';
import { useStore } from 'containers/Layout/store';
import { useIsConnectedAccountVip } from 'hooks/useIsConnectedAccountVip';
import { useIsUserPrime } from 'hooks/useIsUserPrime';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAuthModal } from 'libs/wallet';
import { AccountModal } from './AccountModal';
import { UserButton } from './UserButton';

export const ConnectButton: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { isConnectedAccountVip } = useIsConnectedAccountVip();

  const { t } = useTranslation();

  const { openAuthModal } = useAuthModal();

  const openModal = useStore(state => state.openModal);
  const setOpenModal = useStore(state => state.setOpenModal);

  const isModalOpen = openModal === 'accountModal';

  const handleToggleAccountModal = () => setOpenModal(isModalOpen ? undefined : 'accountModal');
  const handleCloseAccountModal = () => setOpenModal(undefined);

  const handleConnectButtonClick = () => {
    openAuthModal({
      analyticVariant: 'header_connect_button',
    });
  };

  const { isUserPrime: isAccountPrime, isLoading: isUserPrimeLoading } = useIsUserPrime({
    accountAddress,
  });

  if (isUserPrimeLoading) {
    return undefined;
  }

  if (accountAddress) {
    return (
      <div>
        <UserButton
          onClick={handleToggleAccountModal}
          address={accountAddress}
          isPrime={isAccountPrime}
          isVip={isConnectedAccountVip}
        />

        {isModalOpen && (
          <AccountModal
            address={accountAddress}
            isPrime={isAccountPrime}
            isVip={isConnectedAccountVip}
            onClose={handleCloseAccountModal}
          />
        )}
      </div>
    );
  }

  return (
    <Button onClick={handleConnectButtonClick} className="h-10 px-3 sm:h-12">
      {t('connectButton.connect')}
    </Button>
  );
};
