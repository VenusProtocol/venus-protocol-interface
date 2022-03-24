/** @jsxImportSource @emotion/react */
import React from 'react';

import { AuthContext } from 'context/AuthContext';
import { truncateAddress } from 'utilities/truncateAddress';
import { SecondaryButton, IButtonProps } from '../../Button';

export interface IConnectButton extends IButtonProps {
  accountAddress?: string;
  title?: string;
}

export const ConnectButton: React.FC<IConnectButton> = ({
  accountAddress,
  title = 'Connect',
  ...otherProps
}) => (
  <SecondaryButton {...otherProps}>
    {!accountAddress ? title : truncateAddress(accountAddress)}
  </SecondaryButton>
);

const ConnectButtonContainer: React.FC<IButtonProps> = props => {
  const { account, openAuthModal } = React.useContext(AuthContext);
  return <ConnectButton accountAddress={account?.address} onClick={openAuthModal} {...props} />;
};

export default ConnectButtonContainer;
