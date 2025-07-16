import arbitrumLogo from './img/chains/arbitrum.svg';
import baseLogo from './img/chains/base.svg';
import berachainLogo from './img/chains/berachain.svg';
import bscLogo from './img/chains/bsc.svg';
import ethLogo from './img/chains/eth.svg';
import opbnbLogo from './img/chains/opbnb.svg';
import optimismLogo from './img/chains/optimism.svg';
import unichainLogo from './img/chains/unichain.svg';
import zkSyncLogo from './img/chains/zkSync.svg';
import bnbTokenLogo from './img/tokens/bnb.svg';
import ethTokenLogo from './img/tokens/eth.svg';
import { ChainId, type ChainMetadata, type Token } from './types';

// TODO: import from @venusprotocol/tokens package once it's been created
const bnb: Token = {
  address: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  decimals: 18,
  symbol: 'BNB',
  asset: bnbTokenLogo,
  isNative: true,
};

const eth: Token = {
  address: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  decimals: 18,
  symbol: 'ETH',
  asset: ethTokenLogo,
  isNative: true,
};

export const chainMetadata: {
  [chainId in ChainId]: ChainMetadata;
} = {
  [ChainId.BSC_MAINNET]: {
    name: 'BNB Chain',
    logoSrc: bscLogo,
    explorerUrl: 'https://bscscan.com',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-bsc.safe.global',
    blockTimeMs: 750,
    blocksPerDay: 115200,
    corePoolComptrollerContractAddress: '0xfD36E2c2a6789Db23113685031d7F16329158384',
    nativeToken: bnb,
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BNB testnet',
    logoSrc: bscLogo,
    explorerUrl: 'https://testnet.bscscan.com',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    blockTimeMs: 750,
    blocksPerDay: 115200,
    corePoolComptrollerContractAddress: '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
    nativeToken: bnb,
  },
  [ChainId.OPBNB_MAINNET]: {
    name: 'opBNB',
    logoSrc: opbnbLogo,
    explorerUrl: 'https://opbnbscan.com',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    blockTimeMs: 500,
    blocksPerDay: 172800,
    nativeToken: bnb,
  },
  [ChainId.OPBNB_TESTNET]: {
    name: 'opBNB testnet',
    logoSrc: opbnbLogo,
    explorerUrl: 'https://testnet.opbnbscan.com',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    blockTimeMs: 500,
    blocksPerDay: 172800,
    nativeToken: bnb,
  },
  [ChainId.ETHEREUM]: {
    name: 'Ethereum',
    logoSrc: ethLogo,
    explorerUrl: 'https://etherscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-mainnet.safe.global',
    blockTimeMs: 12000,
    blocksPerDay: 7200,
    nativeToken: eth,
  },
  [ChainId.SEPOLIA]: {
    name: 'Sepolia',
    logoSrc: ethLogo,
    explorerUrl: 'https://sepolia.etherscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-sepolia.safe.global',
    blockTimeMs: 12000,
    blocksPerDay: 7200,
    nativeToken: eth,
  },
  [ChainId.ARBITRUM_ONE]: {
    name: 'Arbitrum One',
    logoSrc: arbitrumLogo,
    explorerUrl: 'https://arbiscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-arbitrum.safe.global',
    nativeToken: eth,
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    name: 'Arbitrum Sepolia',
    logoSrc: arbitrumLogo,
    explorerUrl: 'https://sepolia.arbiscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    nativeToken: eth,
  },
  [ChainId.ZKSYNC_MAINNET]: {
    name: 'ZKsync',
    logoSrc: zkSyncLogo,
    explorerUrl: 'https://explorer.zksync.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-zksync.safe.global',
    nativeToken: eth,
  },
  [ChainId.ZKSYNC_SEPOLIA]: {
    name: 'ZKsync Sepolia',
    logoSrc: zkSyncLogo,
    explorerUrl: 'https://sepolia.explorer.zksync.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    nativeToken: eth,
  },
  [ChainId.OPTIMISM_MAINNET]: {
    name: 'Optimism',
    logoSrc: optimismLogo,
    explorerUrl: 'https://optimistic.etherscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-optimism.safe.global',
    nativeToken: eth,
  },
  [ChainId.OPTIMISM_SEPOLIA]: {
    name: 'Optimism Sepolia',
    logoSrc: optimismLogo,
    explorerUrl: 'https://sepolia-optimism.etherscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    nativeToken: eth,
  },
  [ChainId.BASE_MAINNET]: {
    name: 'Base',
    logoSrc: baseLogo,
    explorerUrl: 'https://basescan.org',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-base.safe.global',
    nativeToken: eth,
  },
  [ChainId.BASE_SEPOLIA]: {
    name: 'Base Sepolia',
    logoSrc: baseLogo,
    explorerUrl: 'https://sepolia.basescan.org',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-base-sepolia.safe.global',
    nativeToken: eth,
  },
  [ChainId.UNICHAIN_MAINNET]: {
    name: 'Unichain',
    logoSrc: unichainLogo,
    explorerUrl: 'https://uniscan.xyz',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    nativeToken: eth,
  },
  [ChainId.UNICHAIN_SEPOLIA]: {
    name: 'Unichain Sepolia',
    logoSrc: unichainLogo,
    explorerUrl: 'https://sepolia.uniscan.xyz',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    nativeToken: eth,
  },
  [ChainId.BERACHAIN_MAINNET]: {
    name: 'Berachain',
    logoSrc: berachainLogo,
    explorerUrl: 'https://berascan.com',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    nativeToken: eth,
  },
  [ChainId.BERACHAIN_BEPOLIA]: {
    name: 'Berachain Bepolia',
    logoSrc: berachainLogo,
    explorerUrl: 'https://bepolia.beratrail.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    nativeToken: eth,
  },
};
