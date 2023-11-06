import { ChainId } from 'types';

export const BLOCK_TIME_MS = 3000;
// 20 blocks a minute, 60 minutes an hour, 24 hours a day
export const BLOCKS_PER_DAY = (60 / (BLOCK_TIME_MS / 1000)) * 60 * 24;

export const EXPLORER_URLS = {
  [ChainId.BSC_MAINNET]: 'https://bscscan.com',
  [ChainId.BSC_TESTNET]: 'https://testnet.bscscan.com',
  [ChainId.ETHEREUM]: 'https://etherscan.io/',
  [ChainId.SEPOLIA]: 'https://sepolia.etherscan.io/',
};
