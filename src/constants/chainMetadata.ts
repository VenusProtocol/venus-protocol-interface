import bnbLogo from 'packages/tokens/img/bnb.svg';
import ethLogo from 'packages/tokens/img/eth.svg';
import { ChainId, ChainMetadata } from 'types';

export const CHAIN_METADATA: {
  [chainId in ChainId]: ChainMetadata;
} = {
  [ChainId.BSC_MAINNET]: {
    name: 'BSC',
    logoSrc: bnbLogo,
    explorerUrl: 'https://bscscan.com',
    blockTimeMs: 3000,
    blocksPerDay: 28800,
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BSC Testnet',
    logoSrc: bnbLogo,
    explorerUrl: 'https://testnet.bscscan.com',
    blockTimeMs: 3000,
    blocksPerDay: 28800,
  },
  [ChainId.ETHEREUM]: {
    name: 'Ethereum',
    logoSrc: ethLogo,
    explorerUrl: 'https://etherscan.io/',
    blockTimeMs: 12000,
    blocksPerDay: 7200,
  },
  [ChainId.SEPOLIA]: {
    name: 'Sepolia',
    logoSrc: ethLogo,
    explorerUrl: 'https://sepolia.etherscan.io/',
    blockTimeMs: 12000,
    blocksPerDay: 7200,
  },
};
