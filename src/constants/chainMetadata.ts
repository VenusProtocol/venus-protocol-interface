import bnbLogo from 'packages/tokens/img/bnb.svg';
import ethLogo from 'packages/tokens/img/eth.svg';
import { ChainId, ChainMetadata } from 'types';

export const CHAIN_METADATA: {
  [chainId in ChainId]: ChainMetadata;
} = {
  [ChainId.BSC_MAINNET]: {
    name: 'BNB mainnet',
    logoSrc: bnbLogo,
    explorerUrl: 'https://bscscan.com',
    blockTimeMs: 3000,
    blocksPerDay: 28800,
    corePoolComptrollerContractAddress: '0xfD36E2c2a6789Db23113685031d7F16329158384',
    nativeCurrencySymbol: 'BNB',
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BNB testnet',
    logoSrc: bnbLogo,
    explorerUrl: 'https://testnet.bscscan.com',
    blockTimeMs: 3000,
    blocksPerDay: 28800,
    corePoolComptrollerContractAddress: '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
    nativeCurrencySymbol: 'BNB',
  },
  [ChainId.OPBNB_TESTNET]: {
    name: 'opBNB testnet',
    logoSrc: bnbLogo,
    explorerUrl: 'https://opbnb-testnet.bscscan.com/',
    blockTimeMs: 1000,
    blocksPerDay: 86400,
    corePoolComptrollerContractAddress: '0x2FCABb31E57F010D623D8d68e1E18Aed11d5A388',
  },
  [ChainId.ETHEREUM]: {
    name: 'Ethereum',
    logoSrc: ethLogo,
    explorerUrl: 'https://etherscan.io',
    blockTimeMs: 12000,
    blocksPerDay: 7200,
    corePoolComptrollerContractAddress: '', // TODO: add record (see VEN-2120)
    nativeCurrencySymbol: 'ETH',
  },
  [ChainId.SEPOLIA]: {
    name: 'Sepolia',
    logoSrc: ethLogo,
    explorerUrl: 'https://sepolia.etherscan.io',
    blockTimeMs: 12000,
    blocksPerDay: 7200,
    corePoolComptrollerContractAddress: '0x7Aa39ab4BcA897F403425C9C6FDbd0f882Be0D70',
    nativeCurrencySymbol: 'ETH',
  },
};
