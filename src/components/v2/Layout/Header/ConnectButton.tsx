/** @jsxImportSource @emotion/react */
import React from 'react';

import { AuthContext } from 'context/AuthContext';
import { truncateAddress } from 'utilities/truncateAddress';
import { SecondaryButton, IButtonProps } from '../../Button';

export interface IConnectButton extends IButtonProps {
  openAuthModal: () => void;
  accountAddress?: string;
}

export const ConnectButton: React.FC<IConnectButton> = ({
  openAuthModal,
  accountAddress,
  ...otherProps
}) => (
  <SecondaryButton onClick={openAuthModal} {...otherProps}>
    {!accountAddress ? 'Connect' : truncateAddress(accountAddress)}
  </SecondaryButton>
);

const ConnectButtonContainer: React.FC<IButtonProps> = props => {
  const { account, openAuthModal } = React.useContext(AuthContext);
  return (
    <ConnectButton accountAddress={account?.address} openAuthModal={openAuthModal} {...props} />
  );
};

export default ConnectButtonContainer;
