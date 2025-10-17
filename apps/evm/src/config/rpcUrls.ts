import { getRpcUrls } from '@venusprotocol/chains';

import { envVariables } from './envVariables';

export const rpcUrls = getRpcUrls({
  nodeRealApiKey: envVariables.VITE_NODE_REAL_API_KEY,
  alchemyApiKey: envVariables.VITE_ALCHEMY_API_KEY,
});
