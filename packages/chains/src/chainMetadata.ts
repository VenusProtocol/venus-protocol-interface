import arbitrumLogo from './img/chains/arbitrum.svg';
import baseLogo from './img/chains/base.svg';
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
const bnbToken: Token = {
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  decimals: 18,
  symbol: 'BNB',
  asset: bnbTokenLogo,
  isNative: true,
};

const ethToken: Token = {
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
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
    blockTimeMs: 3000,
    blocksPerDay: 28800,
    corePoolComptrollerContractAddress: '0xfD36E2c2a6789Db23113685031d7F16329158384',
    nativeToken: bnbToken,
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BNB testnet',
    logoSrc: bscLogo,
    explorerUrl: 'https://testnet.bscscan.com',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    blockTimeMs: 3000,
    blocksPerDay: 28800,
    corePoolComptrollerContractAddress: '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
    nativeToken: bnbToken,
  },
  [ChainId.OPBNB_MAINNET]: {
    name: 'opBNB',
    logoSrc: opbnbLogo,
    explorerUrl: 'https://opbnbscan.com',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    blockTimeMs: 1000,
    blocksPerDay: 86400,
    corePoolComptrollerContractAddress: '0xD6e3E2A1d8d95caE355D15b3b9f8E5c2511874dd',
    nativeToken: bnbToken,
  },
  [ChainId.OPBNB_TESTNET]: {
    name: 'opBNB testnet',
    logoSrc: opbnbLogo,
    explorerUrl: 'https://testnet.opbnbscan.com',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    blockTimeMs: 1000,
    blocksPerDay: 86400,
    corePoolComptrollerContractAddress: '0x2FCABb31E57F010D623D8d68e1E18Aed11d5A388',
    nativeToken: bnbToken,
  },
  [ChainId.ETHEREUM]: {
    name: 'Ethereum',
    logoSrc: ethLogo,
    explorerUrl: 'https://etherscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    blockTimeMs: 12000,
    blocksPerDay: 7200,
    corePoolComptrollerContractAddress: '0x687a01ecF6d3907658f7A7c714749fAC32336D1B',
    lstPoolComptrollerContractAddress: '0xF522cd0360EF8c2FF48B648d53EA1717Ec0F3Ac3',
    lstPoolVWstEthContractAddress: '0x4a240F0ee138697726C8a3E43eFE6Ac3593432CB',
    nativeToken: ethToken,
  },
  [ChainId.SEPOLIA]: {
    name: 'Sepolia',
    logoSrc: ethLogo,
    explorerUrl: 'https://sepolia.etherscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    blockTimeMs: 12000,
    blocksPerDay: 7200,
    corePoolComptrollerContractAddress: '0x7Aa39ab4BcA897F403425C9C6FDbd0f882Be0D70',
    lstPoolComptrollerContractAddress: '0xd79CeB8EF8188E44b7Eb899094e8A3A4d7A1e236',
    lstPoolVWstEthContractAddress: '0x0a95088403229331FeF1EB26a11F9d6C8E73f23D',
    nativeToken: ethToken,
  },
  [ChainId.ARBITRUM_ONE]: {
    name: 'Arbitrum One',
    logoSrc: arbitrumLogo,
    explorerUrl: 'https://arbiscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x317c1A5739F39046E20b08ac9BeEa3f10fD43326',
    lstPoolComptrollerContractAddress: '0x52bAB1aF7Ff770551BD05b9FC2329a0Bf5E23F16',
    lstPoolVWstEthContractAddress: '0x9df6B5132135f14719696bBAe3C54BAb272fDb16',
    nativeToken: ethToken,
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    name: 'Arbitrum Sepolia',
    logoSrc: arbitrumLogo,
    explorerUrl: 'https://sepolia.arbiscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x006D44b6f5927b3eD83bD0c1C36Fb1A3BaCaC208',
    lstPoolComptrollerContractAddress: '0x3D04F926b2a165BBa17FBfccCCB61513634fa5e4',
    lstPoolVWstEthContractAddress: '0x253515E19e8b888a4CA5a0a3363B712402ce4046',
    nativeToken: ethToken,
  },
  [ChainId.ZKSYNC_MAINNET]: {
    name: 'zkSync',
    logoSrc: zkSyncLogo,
    explorerUrl: 'https://explorer.zksync.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    corePoolComptrollerContractAddress: '0xddE4D098D9995B659724ae6d5E3FB9681Ac941B1',
    nativeToken: ethToken,
  },
  [ChainId.ZKSYNC_SEPOLIA]: {
    name: 'zkSync Sepolia',
    logoSrc: zkSyncLogo,
    explorerUrl: 'https://sepolia.explorer.zksync.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0xC527DE08E43aeFD759F7c0e6aE85433923064669',
    nativeToken: ethToken,
  },
  [ChainId.OPTIMISM_MAINNET]: {
    name: 'Optimism',
    logoSrc: optimismLogo,
    explorerUrl: 'https://optimistic.etherscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x5593FF68bE84C966821eEf5F0a988C285D5B7CeC',
    nativeToken: ethToken,
  },
  [ChainId.OPTIMISM_SEPOLIA]: {
    name: 'Optimism Sepolia',
    logoSrc: optimismLogo,
    explorerUrl: 'https://sepolia-optimism.etherscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x59d10988974223B042767aaBFb6D926863069535',
    nativeToken: ethToken,
  },
  [ChainId.BASE_MAINNET]: {
    name: 'Base',
    logoSrc: baseLogo,
    explorerUrl: 'https://basescan.org',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x0C7973F9598AA62f9e03B94E92C967fD5437426C',
    nativeToken: ethToken,
  },
  [ChainId.BASE_SEPOLIA]: {
    name: 'Base Sepolia',
    logoSrc: baseLogo,
    explorerUrl: 'https://sepolia.basescan.org',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x272795dd6c5355CF25765F36043F34014454Eb5b',
    nativeToken: ethToken,
  },
  [ChainId.UNICHAIN_MAINNET]: {
    name: 'Unichain',
    logoSrc: unichainLogo,
    explorerUrl: 'https://uniscan.xyz',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    corePoolComptrollerContractAddress: '0xe22af1e6b78318e1Fe1053Edbd7209b8Fc62c4Fe',
    nativeToken: ethToken,
  },
  [ChainId.UNICHAIN_SEPOLIA]: {
    name: 'Unichain Sepolia',
    logoSrc: unichainLogo,
    explorerUrl: 'https://sepolia.uniscan.xyz',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0xFeD3eAA668a6179c9E5E1A84e3A7d6883F06f7c1',
    nativeToken: ethToken,
  },
};
