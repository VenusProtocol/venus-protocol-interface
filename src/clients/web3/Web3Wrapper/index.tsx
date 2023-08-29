import React from 'react';
import { WagmiConfig } from 'wagmi';

import config from './config';

export * from './config';
export { default as config } from './config';

const Web3Wrapper: React.FC = ({ children }) => (
  <WagmiConfig config={config}>{children}</WagmiConfig>
);

export default Web3Wrapper;
