/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTranslation } from 'translation';
import { truncateAddress } from 'utilities';

import { AuthContext } from 'context/AuthContext';

import { ButtonProps, SecondaryButton } from '../../Button';

export interface ConnectButtonProps extends ButtonProps {
  accountAddress?: string;
}

export const ConnectButtonUi: React.FC<ConnectButtonProps> = ({
  accountAddress,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <SecondaryButton {...otherProps}>
      {!accountAddress ? t('connectButton.title') : truncateAddress(accountAddress)}
    </SecondaryButton>
  );
};

export const ConnectButton: React.FC<ButtonProps> = props => {
  const { account, openAuthModal } = React.useContext(AuthContext);
  return (
    <ConnectButtonUi
      accountAddress={account?.address}
      onClick={openAuthModal}
      variant={account ? 'secondary' : 'primary'}
      {...props}
    />
  );
};

export default ConnectButton;
