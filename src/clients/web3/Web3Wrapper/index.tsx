import React from 'react';
import { WagmiConfig } from 'wagmi';

import client from './client';

export * from './client';

const Web3Wrapper: React.FC = ({ children }) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
);

export default Web3Wrapper;
