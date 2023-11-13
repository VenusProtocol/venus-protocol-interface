import bnbLogo from 'packages/tokens/img/bnb.svg';
import ethLogo from 'packages/tokens/img/eth.svg';
import { ChainId, ChainMetadata } from 'types';

export const chainsMetadata: {
  [chainId in ChainId]: ChainMetadata;
} = {
  [ChainId.BSC_MAINNET]: {
    name: 'BSC',
    logoSrc: bnbLogo,
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BSC Testnet',
    logoSrc: bnbLogo,
  },
  [ChainId.ETHEREUM]: {
    name: 'Ethereum',
    logoSrc: ethLogo,
  },
  [ChainId.SEPOLIA]: {
    name: 'Sepolia',
    logoSrc: ethLogo,
  },
};
