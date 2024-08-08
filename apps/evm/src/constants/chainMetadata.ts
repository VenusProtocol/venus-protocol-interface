import { getToken } from 'libs/tokens/utilities/getToken';
import arbitrumLogo from 'libs/wallet/img/chains/arbitrum.svg';
import bscLogo from 'libs/wallet/img/chains/bsc.svg';
import ethLogo from 'libs/wallet/img/chains/eth.svg';
import opbnbLogo from 'libs/wallet/img/chains/opbnb.svg';
import { ChainId, type ChainMetadata } from 'types';

const PROPOSAL_EXECUTION_GRACE_PERIOD_MS = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

export const CHAIN_METADATA: {
  [chainId in ChainId]: ChainMetadata;
} = {
  [ChainId.BSC_MAINNET]: {
    name: 'BNB Chain',
    logoSrc: bscLogo,
    explorerUrl: 'https://bscscan.com',
    layerZeroScanUrl: 'https://layerzeroscan.com/',
    blockTimeMs: 3000,
    blocksPerDay: 28800,
    corePoolComptrollerContractAddress: '0xfD36E2c2a6789Db23113685031d7F16329158384',
    proposalExecutionGracePeriodMs: PROPOSAL_EXECUTION_GRACE_PERIOD_MS,
    nativeToken: getToken({ chainId: ChainId.BSC_MAINNET, symbol: 'BNB' })!,
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BNB testnet',
    logoSrc: bscLogo,
    explorerUrl: 'https://testnet.bscscan.com',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com/',
    blockTimeMs: 3000,
    blocksPerDay: 28800,
    corePoolComptrollerContractAddress: '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
    proposalExecutionGracePeriodMs: PROPOSAL_EXECUTION_GRACE_PERIOD_MS,
    nativeToken: getToken({ chainId: ChainId.BSC_TESTNET, symbol: 'BNB' })!,
  },
  [ChainId.OPBNB_MAINNET]: {
    name: 'opBNB',
    logoSrc: opbnbLogo,
    explorerUrl: 'https://opbnbscan.com',
    layerZeroScanUrl: 'https://layerzeroscan.com/',
    blockTimeMs: 1000,
    blocksPerDay: 86400,
    corePoolComptrollerContractAddress: '0xD6e3E2A1d8d95caE355D15b3b9f8E5c2511874dd',
    nativeToken: getToken({ chainId: ChainId.OPBNB_MAINNET, symbol: 'BNB' })!,
  },
  [ChainId.OPBNB_TESTNET]: {
    name: 'opBNB testnet',
    logoSrc: opbnbLogo,
    explorerUrl: 'https://testnet.opbnbscan.com',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com/',
    blockTimeMs: 1000,
    blocksPerDay: 86400,
    corePoolComptrollerContractAddress: '0x2FCABb31E57F010D623D8d68e1E18Aed11d5A388',
    nativeToken: getToken({ chainId: ChainId.OPBNB_TESTNET, symbol: 'BNB' })!,
  },
  [ChainId.ETHEREUM]: {
    name: 'Ethereum',
    logoSrc: ethLogo,
    explorerUrl: 'https://etherscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com/',
    blockTimeMs: 12000,
    blocksPerDay: 7200,
    corePoolComptrollerContractAddress: '0x687a01ecF6d3907658f7A7c714749fAC32336D1B',
    stakedEthPoolComptrollerContractAddress: '0xF522cd0360EF8c2FF48B648d53EA1717Ec0F3Ac3',
    wstEthContractAddress: '0x4a240F0ee138697726C8a3E43eFE6Ac3593432CB',
    nativeToken: getToken({ chainId: ChainId.ETHEREUM, symbol: 'ETH' })!,
  },
  [ChainId.SEPOLIA]: {
    name: 'Sepolia',
    logoSrc: ethLogo,
    explorerUrl: 'https://sepolia.etherscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com/',
    blockTimeMs: 12000,
    blocksPerDay: 7200,
    corePoolComptrollerContractAddress: '0x7Aa39ab4BcA897F403425C9C6FDbd0f882Be0D70',
    stakedEthPoolComptrollerContractAddress: '0xd79CeB8EF8188E44b7Eb899094e8A3A4d7A1e236',
    wstEthContractAddress: '0x0a95088403229331FeF1EB26a11F9d6C8E73f23D',
    nativeToken: getToken({ chainId: ChainId.SEPOLIA, symbol: 'ETH' })!,
  },
  [ChainId.ARBITRUM_ONE]: {
    name: 'Arbitrum One',
    logoSrc: arbitrumLogo,
    explorerUrl: 'https://arbiscan.io/',
    layerZeroScanUrl: 'https://layerzeroscan.com/',
    corePoolComptrollerContractAddress: '0x317c1A5739F39046E20b08ac9BeEa3f10fD43326',
    nativeToken: getToken({ chainId: ChainId.ARBITRUM_ONE, symbol: 'ETH' })!,
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    name: 'Arbitrum Sepolia',
    logoSrc: arbitrumLogo,
    explorerUrl: 'https://sepolia.arbiscan.io/',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com/',
    corePoolComptrollerContractAddress: '0x006D44b6f5927b3eD83bD0c1C36Fb1A3BaCaC208',
    nativeToken: getToken({ chainId: ChainId.ARBITRUM_SEPOLIA, symbol: 'ETH' })!,
  },
};
