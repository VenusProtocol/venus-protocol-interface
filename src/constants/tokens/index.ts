import config from 'config';

import { MAINNET_TOKENS } from './common/mainnet';
import { TESTNET_TOKENS } from './common/testnet';
import { MAINNET_SWAP_TOKENS } from './swap/mainnet';
import { TESTNET_SWAP_TOKENS } from './swap/testnet';
import { MAINNET_VBEP_TOKENS } from './vBep/mainnet';
import { TESTNET_VBEP_TOKENS } from './vBep/testnet';

export * from './common/mainnet';
export * from './common/testnet';
export * from './swap/mainnet';
export * from './swap/testnet';
export * from './vBep/testnet';
export * from './vBep/mainnet';

export const TOKENS = config.isOnTestnet ? TESTNET_TOKENS : MAINNET_TOKENS;

export const VBEP_TOKENS = config.isOnTestnet ? TESTNET_VBEP_TOKENS : MAINNET_VBEP_TOKENS;

export const SWAP_TOKENS = config.isOnTestnet ? TESTNET_SWAP_TOKENS : MAINNET_SWAP_TOKENS;
