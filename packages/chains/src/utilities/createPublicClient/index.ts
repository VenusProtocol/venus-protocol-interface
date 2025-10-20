import { http, createPublicClient as createViemPublicClient, fallback } from 'viem';

import { viemChains } from '../../chains/viemChains';
import { rpcUrls } from '../../config/rpcUrls';
import type { ChainId } from '../../types';

export const createPublicClient = ({ chainId }: { chainId: ChainId }) =>
  createViemPublicClient({
    chain: viemChains[chainId],
    transport: fallback(rpcUrls[chainId].map(url => http(url))),
  });
