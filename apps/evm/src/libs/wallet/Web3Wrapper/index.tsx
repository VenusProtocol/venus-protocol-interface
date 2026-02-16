import { WagmiProvider } from 'wagmi';
import { RainwbowKitWrapper } from './RainbowKitWrapper';
import config from './config';

export interface Web3WrapperProps {
  children?: React.ReactNode;
}

export const Web3Wrapper: React.FC<Web3WrapperProps> = ({ children }) => (
  <WagmiProvider config={config}>
    <RainwbowKitWrapper>{children}</RainwbowKitWrapper>
  </WagmiProvider>
);
