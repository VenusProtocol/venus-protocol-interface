import { cn } from '@venusprotocol/ui';
import { useGetPrimeToken } from 'clients/api';
import { Button, type ButtonProps, Modal, SecondaryButton, Username } from 'components';
import config from 'config';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAuthModal } from 'libs/wallet';

import { useState } from 'react';
import { useDisconnect } from 'wagmi';
import { PrimeButton } from './PrimeButton';

export interface ConnectButtonProps
  extends Omit<
    ButtonProps,
    'isAccountPrime' | 'accountAddress' | 'loading' | 'onClick' | 'variant'
  > {
  variant?: 'primary' | 'secondary';
}

const connectedAccountButtonClasses = cn(
  'border-white hover:bg-white hover:border-transparent hover:text-background active:bg-grey active:border-transparent',
);

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  className,
  variant = 'primary',
  ...otherProps
}) => {
  const { disconnect } = useDisconnect();
  const { accountAddress } = useAccountAddress();

  const { openAuthModal } = useAuthModal();

  const { t } = useTranslation();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const openAccountModal = () => setIsAccountModalOpen(true);
  const closeAccountModal = () => setIsAccountModalOpen(false);

  const handleConnectButtonClick = () => {
    if (accountAddress) {
      openAccountModal();
    } else {
      openAuthModal({
        analyticVariant: 'header_connect_button',
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    closeAccountModal();
  };

  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken({
    accountAddress,
  });
  const isAccountPrime = !!getPrimeTokenData?.exists;

  if (isGetPrimeTokenLoading) {
    return null;
  }

  const content = accountAddress ? (
    <Username
      className="max-w-30 sm:max-w-full"
      showProvider={false}
      showTooltip={false}
      address={accountAddress}
      shouldEllipseAddress
    />
  ) : (
    t('connectButton.connect')
  );

  return (
    <>
      {accountAddress && isAccountPrime ? (
        <PrimeButton
          accountAddress={accountAddress}
          onClick={handleConnectButtonClick}
          className={cn(variant === 'secondary' && connectedAccountButtonClasses, className)}
          {...otherProps}
        />
      ) : (
        <Button
          variant={accountAddress ? 'secondary' : 'primary'}
          onClick={handleConnectButtonClick}
          className={cn(
            className,
            variant === 'secondary' && accountAddress && connectedAccountButtonClasses,
            variant === 'secondary' &&
              !accountAddress &&
              'border-transparent bg-white text-background hover:border-transparent hover:bg-grey active:bg-grey active:border-transparent',
          )}
          {...otherProps}
        >
          {content}
        </Button>
      )}

      <Modal isOpen={isAccountModalOpen} handleClose={closeAccountModal}>
        <div className="space-y-10">
          {!!accountAddress && (
            <div className="flex truncate items-center justify-between space-x-2 break-all">
              <Username address={accountAddress} shouldEllipseAddress={false} showCopyAddress />
            </div>
          )}
          {/* When running in Safe Wallet app, user's wallet should be kept connected at all time */}
          {!config.isSafeApp && (
            <SecondaryButton onClick={handleDisconnect} className="w-full">
              {t('connectButton.disconnect')}
            </SecondaryButton>
          )}
        </div>
      </Modal>
    </>
  );
};
