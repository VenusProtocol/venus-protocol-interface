import { WagmiConfig } from 'wagmi';

import { AuthModal } from './AuthModal';
import { ChainHandler } from './ChainHandler';
import config from './config';

export interface Web3WrapperProps {
  children?: React.ReactNode;
}

export const Web3Wrapper: React.FC<Web3WrapperProps> = ({ children }) => (
  <WagmiConfig config={config}>
    <AuthModal />
    <ChainHandler />

    {children}
  </WagmiConfig>
);
