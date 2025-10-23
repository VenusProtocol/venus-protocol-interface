import { getRpcUrls } from '../utilities/getRpcUrls';

if (!process.env.CLI_NODE_REAL_API_KEY) {
  throw new Error('CLI_NODE_REAL_API_KEY env variable missing in chains package');
}

if (!process.env.CLI_ALCHEMY_API_KEY) {
  throw new Error('CLI_ALCHEMY_API_KEY env variable missing in chains package');
}

export const rpcUrls = getRpcUrls({
  nodeRealApiKey: process.env.CLI_NODE_REAL_API_KEY,
  alchemyApiKey: process.env.CLI_ALCHEMY_API_KEY,
});
