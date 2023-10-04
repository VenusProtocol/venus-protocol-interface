/** @jsxImportSource @emotion/react */
import { Button, ButtonProps } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { cn, isFeatureEnabled, truncateAddress } from 'utilities';

import primeLogoSrc from 'assets/img/primeLogo.svg';
import { useAuth } from 'context/AuthContext';

export interface ConnectButtonProps extends ButtonProps {
  isPrime: boolean;
  accountAddress?: string;
}

export const ConnectButtonUi: React.FC<ConnectButtonProps> = ({
  accountAddress,
  isPrime,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <Button
      variant={accountAddress ? 'secondary' : 'primary'}
      className={cn(
        isPrime &&
          'relative border-transparent bg-background bg-clip-padding before:absolute before:inset-0 before:-z-[1] before:-m-[1px] before:rounded-lg before:bg-gradient-to-r before:from-[#805c4e] before:to-[#e3cdc3] before:content-[""] hover:border-transparent hover:bg-cards active:border-transparent active:bg-cards',
        className,
      )}
      {...otherProps}
    >
      {accountAddress ? (
        <>
          {isPrime && (
            <img className="mr-2 w-5" src={primeLogoSrc} alt={t('connectButton.primeLogoAlt')} />
          )}
          {truncateAddress(accountAddress)}
        </>
      ) : (
        t('connectButton.title')
      )}
    </Button>
  );
};

export const ConnectButton: React.FC<ButtonProps> = props => {
  const { accountAddress, openAuthModal, isPrime } = useAuth();

  return (
    <ConnectButtonUi
      accountAddress={accountAddress}
      isPrime={isFeatureEnabled('prime') && isPrime}
      onClick={openAuthModal}
      {...props}
    />
  );
};

export default ConnectButton;
