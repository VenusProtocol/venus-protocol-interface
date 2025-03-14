import BigNumber from 'bignumber.js';
import { ChainId } from 'types';
import type { Address } from 'viem';

export const MIN_PAYMASTER_BALANCE_MANTISSA = new BigNumber(10).pow(15);

export const zyFiWalletAddresses: Partial<Record<ChainId, Address>> = {
  [ChainId.ZKSYNC_MAINNET]: '0x5768CDebd229F690F4bC045AF8e140FC97Ce275D',
  [ChainId.ZKSYNC_SEPOLIA]: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
};
