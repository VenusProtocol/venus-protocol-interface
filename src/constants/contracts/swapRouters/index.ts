import config from 'config';

import { MAINNET_SWAP_ROUTERS } from './mainnet';
import { TESTNET_SWAP_ROUTERS } from './testnet';

export * from './mainnet';
export * from './testnet';

export const SWAP_ROUTERS = config.isOnTestnet ? TESTNET_SWAP_ROUTERS : MAINNET_SWAP_ROUTERS;
