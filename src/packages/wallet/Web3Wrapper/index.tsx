import { WagmiConfig } from 'wagmi';

import { AuthModal } from './AuthModal';
import { Disconnector } from './Disconnector';
import config from './config';

export interface Web3WrapperProps {
  children?: React.ReactNode;
}

export const Web3Wrapper: React.FC<Web3WrapperProps> = ({ children }) => (
  <WagmiConfig config={config}>
    <AuthModal />

    <Disconnector />

    {children}
  </WagmiConfig>
);
