import { WagmiProvider } from 'wagmi';
import { ConnectKitWrapper } from './ConnectKitWrapper';
import config from './config';

export interface Web3WrapperProps {
  children?: React.ReactNode;
}

export const Web3Wrapper: React.FC<Web3WrapperProps> = ({ children }) => (
  <WagmiProvider config={config}>
    <ConnectKitWrapper>{children}</ConnectKitWrapper>
  </WagmiProvider>
);
