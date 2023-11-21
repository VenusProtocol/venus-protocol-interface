import React from 'react';
import { WagmiConfig } from 'wagmi';

import config from './config';

export interface Web3WrapperProps {
  children?: React.ReactNode;
}

const Web3Wrapper: React.FC<Web3WrapperProps> = ({ children }) => (
  <WagmiConfig config={config}>{children}</WagmiConfig>
);

export default Web3Wrapper;
