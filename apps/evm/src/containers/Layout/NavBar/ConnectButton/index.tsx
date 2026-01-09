import { cn } from '@venusprotocol/ui';
import { useState } from 'react';
import { useDisconnect } from 'wagmi';

import primeLogoSrc from 'assets/img/primeLogo.svg';
import { useGetPrimeToken } from 'clients/api';
import { Button, type ButtonProps, Icon, Modal, SecondaryButton, Username } from 'components';
import config from 'config';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAuthModal } from 'libs/wallet';

export interface ConnectButtonProps
  extends Omit<
    ButtonProps,
    'isAccountPrime' | 'accountAddress' | 'loading' | 'onClick' | 'variant'
  > {}

export const ConnectButton: React.FC<ConnectButtonProps> = ({ className, ...otherProps }) => {
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
    return undefined;
  }

  return (
    <>
      <Button
        onClick={handleConnectButtonClick}
        className={cn(
          accountAddress && 'bg-transparent hover:bg-dark-blue active:bg-dark-blue-active',
          accountAddress && !isAccountPrime && 'border-dark-blue-hover',
          accountAddress &&
            isAccountPrime &&
            'border-[#805C4E] hover:border-[#805C4E] active:border-[#805C4E]',
          className,
        )}
        {...otherProps}
      >
        {accountAddress ? (
          <div className="flex items-center gap-x-3">
            {isAccountPrime ? (
              <img className="h-4" src={primeLogoSrc} alt={t('primeButton.primeLogoAlt')} />
            ) : (
              <Icon name="user" className="h-4 text-light-grey mb-1" />
            )}

            <Username
              className="max-w-30 sm:max-w-full"
              showProvider={false}
              showTooltip={false}
              address={accountAddress}
              shouldEllipseAddress
            />

            <Icon name="expand" className="text-light-grey hidden sm:block" />
          </div>
        ) : (
          t('connectButton.connect')
        )}
      </Button>

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
