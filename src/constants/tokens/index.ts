import config from 'config';

import { MAINNET_TOKENS } from './common/mainnet';
import { TESTNET_TOKENS } from './common/testnet';
import { MAINNET_SWAP_TOKENS } from './swap/mainnet';
import { TESTNET_SWAP_TOKENS } from './swap/testnet';

export * from './common/mainnet';
export * from './common/testnet';
export * from './swap/mainnet';
export * from './swap/testnet';

export const TOKENS = config.isOnTestnet ? TESTNET_TOKENS : MAINNET_TOKENS;

export const SWAP_TOKENS = config.isOnTestnet ? TESTNET_SWAP_TOKENS : MAINNET_SWAP_TOKENS;
