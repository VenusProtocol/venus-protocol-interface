import { WagmiProvider } from 'wagmi';

import { AuthHandler } from './AuthHandler';
import { AuthModal } from './AuthModal';
import config from './config';

export interface Web3WrapperProps {
  children?: React.ReactNode;
}

export const Web3Wrapper: React.FC<Web3WrapperProps> = ({ children }) => (
  <WagmiProvider config={config}>
    <AuthModal />
    <AuthHandler />

    {children}
  </WagmiProvider>
);
