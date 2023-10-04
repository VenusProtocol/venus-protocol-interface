/** @jsxImportSource @emotion/react */
import clsx from 'clsx';
import { Button, ButtonProps } from 'components';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'translation';
import { isFeatureEnabled, truncateAddress } from 'utilities';

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
      className={twMerge(
        clsx(isFeatureEnabled('prime') && isPrime && 'border-transparent'),
        className,
      )}
      {...otherProps}
    >
      {!accountAddress ? (
        t('connectButton.title')
      ) : (
        <>
          {isFeatureEnabled('prime') && isPrime && (
            <img className="mr-2 w-5" src={primeLogoSrc} alt={t('connectButton.primeLogoAlt')} />
          )}
          {truncateAddress(accountAddress)}
        </>
      )}
    </Button>
  );
};

export const ConnectButton: React.FC<ButtonProps> = props => {
  const { accountAddress, openAuthModal, isPrime } = useAuth();

  return (
    <ConnectButtonUi
      accountAddress={accountAddress}
      isPrime={isPrime}
      onClick={openAuthModal}
      {...props}
    />
  );
};

export default ConnectButton;
