import { useGetAddressDomainName, useGetPrimeToken } from 'clients/api';
import { Button, type ButtonProps, Modal, SecondaryButton } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAuthModal } from 'libs/wallet';
import { cn, truncateAddress } from 'utilities';

import { CopyAddressButton } from 'containers/CopyAddressButton';
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
  'border-offWhite hover:bg-offWhite hover:border-transparent hover:text-background active:bg-grey active:border-transparent',
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
      openAuthModal();
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

  const { data: domainName, isLoading: isGetAddressDomainNameLoading } = useGetAddressDomainName(
    {
      accountAddress: accountAddress!,
    },
    {
      enabled: !!accountAddress,
    },
  );

  if (isGetPrimeTokenLoading || isGetAddressDomainNameLoading) {
    return null;
  }

  let content = accountAddress ? truncateAddress(accountAddress) : t('connectButton.connect');
  if (domainName) {
    content = domainName;
  }

  return (
    <>
      {accountAddress && isAccountPrime ? (
        <PrimeButton
          accountAddress={accountAddress}
          addressDomainName={domainName}
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
              'border-transparent bg-offWhite text-background hover:border-transparent hover:bg-grey active:bg-grey active:border-transparent',
          )}
          {...otherProps}
        >
          {content}
        </Button>
      )}

      <Modal isOpen={isAccountModalOpen} handleClose={closeAccountModal}>
        <div className="space-y-10">
          {!!accountAddress && (
            <div className="flex items-center space-x-2 break-all">
              <span className="flex-1">{domainName ?? accountAddress}</span>

              <CopyAddressButton className="shrink-0" address={accountAddress} />
            </div>
          )}

          <SecondaryButton onClick={handleDisconnect} className="w-full">
            {t('connectButton.disconnect')}
          </SecondaryButton>
        </div>
      </Modal>
    </>
  );
};
