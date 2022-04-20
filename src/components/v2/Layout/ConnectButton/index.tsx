/** @jsxImportSource @emotion/react */
import React from 'react';

import { useTranslation } from 'translation';
import { AuthContext } from 'context/AuthContext';
import { truncateAddress } from 'utilities/truncateAddress';
import { SecondaryButton, IButtonProps } from '../../Button';

export interface IConnectButton extends IButtonProps {
  accountAddress?: string;
}

export const ConnectButtonUi: React.FC<IConnectButton> = ({ accountAddress, ...otherProps }) => {
  const { t } = useTranslation();

  return (
    <SecondaryButton {...otherProps}>
      {!accountAddress ? t('connectButton.title') : truncateAddress(accountAddress)}
    </SecondaryButton>
  );
};

export const ConnectButton: React.FC<IButtonProps> = props => {
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
