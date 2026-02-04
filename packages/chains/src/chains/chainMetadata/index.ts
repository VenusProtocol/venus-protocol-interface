import { iconSrcs } from '../../generated/manifests/chainIcons';
import { bnb, eth } from '../../tokens/nativeTokens';
import { type Chain, ChainId } from '../../types';

export const chains: Record<ChainId, Chain> = {
  [ChainId.BSC_MAINNET]: {
    name: 'BNB Chain',
    iconSrc: iconSrcs.bsc,
    // explorerUrl: 'https://bscscan.com',
    explorerUrl:
      'https://dashboard.tenderly.co/venus-labs/project/testnet/43b649f5-b426-44f5-8052-c7836bdb67f5',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-bsc.safe.global',
    hardforks: [
      {
        startTimestamp: new Date('2020-04-20T13:46:54Z').getTime(), // Genesis
        blockTimeMs: 3000,
      },
      {
        startTimestamp: new Date('2025-04-29T05:05:00Z').getTime(), // Lorentz Upgrade
        blockTimeMs: 1500,
      },
      {
        startTimestamp: new Date('2025-06-30T02:30:00Z').getTime(), // Maxwell Upgrade
        blockTimeMs: 750,
      },
      {
        startTimestamp: new Date('2026-01-14T02:30:00Z').getTime(), // Fermi Upgrade
        blockTimeMs: 450,
      },
    ],
    corePoolComptrollerContractAddress: '0xfD36E2c2a6789Db23113685031d7F16329158384',
    nativeToken: bnb[ChainId.BSC_MAINNET],
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BNB testnet',
    iconSrc: iconSrcs.bsc,
    explorerUrl: 'https://testnet.bscscan.com',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    hardforks: [
      {
        startTimestamp: new Date('2020-06-09T07:57:19Z').getTime(), // Genesis
        blockTimeMs: 3000,
      },
      {
        startTimestamp: new Date('2025-04-08T07:33:00Z').getTime(), // Lorentz Upgrade
        blockTimeMs: 1500,
      },
      {
        startTimestamp: new Date('2025-05-26T07:05:00Z').getTime(), // Maxwell Upgrade
        blockTimeMs: 750,
      },
      {
        startTimestamp: new Date('2025-11-10T02:25:00Z').getTime(), // Fermi Upgrade
        blockTimeMs: 450,
      },
    ],
    corePoolComptrollerContractAddress: '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
    nativeToken: bnb[ChainId.BSC_TESTNET],
  },
  [ChainId.OPBNB_MAINNET]: {
    name: 'opBNB',
    iconSrc: iconSrcs.opBnb,
    explorerUrl: 'https://opbnbscan.com',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    hardforks: [
      {
        startTimestamp: new Date('2023-08-11T11:35:23Z').getTime(), // Genesis
        blockTimeMs: 1000,
      },
      {
        startTimestamp: new Date('2025-04-21T03:00:00Z').getTime(), // Volta Upgrade
        blockTimeMs: 500,
      },
      {
        startTimestamp: new Date('2026-01-07T03:00:00Z').getTime(), // Fourier Upgrade
        blockTimeMs: 250,
      },
    ],
    corePoolComptrollerContractAddress: '0xD6e3E2A1d8d95caE355D15b3b9f8E5c2511874dd',
    nativeToken: bnb[ChainId.OPBNB_MAINNET],
  },
  [ChainId.OPBNB_TESTNET]: {
    name: 'opBNB testnet',
    iconSrc: iconSrcs.opBnb,
    explorerUrl: 'https://testnet.opbnbscan.com',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    hardforks: [
      {
        startTimestamp: new Date('2023-06-16T01:21:46Z').getTime(), // Genesis
        blockTimeMs: 1000,
      },
      {
        startTimestamp: new Date('2025-04-02T03:00:00Z').getTime(), // Volta Upgrade
        blockTimeMs: 500,
      },
      {
        startTimestamp: new Date('2025-11-06T03:00:00Z').getTime(), // Fourier Upgrade
        blockTimeMs: 250,
      },
    ],
    corePoolComptrollerContractAddress: '0x2FCABb31E57F010D623D8d68e1E18Aed11d5A388',
    nativeToken: bnb[ChainId.OPBNB_TESTNET],
  },
  [ChainId.ETHEREUM]: {
    name: 'Ethereum',
    iconSrc: iconSrcs.eth,
    explorerUrl: 'https://etherscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-mainnet.safe.global',
    hardforks: [
      {
        startTimestamp: new Date('2015-07-30T15:26:13Z').getTime(), // Genesis
        blockTimeMs: 12000,
      },
    ],
    corePoolComptrollerContractAddress: '0x687a01ecF6d3907658f7A7c714749fAC32336D1B',
    nativeToken: eth[ChainId.ETHEREUM],
  },
  [ChainId.SEPOLIA]: {
    name: 'Sepolia',
    iconSrc: iconSrcs.eth,
    explorerUrl: 'https://sepolia.etherscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-sepolia.safe.global',
    hardforks: [
      {
        startTimestamp: new Date('2015-07-30T15:26:13Z').getTime(), // Genesis
        blockTimeMs: 12000,
      },
    ],
    corePoolComptrollerContractAddress: '0x7Aa39ab4BcA897F403425C9C6FDbd0f882Be0D70',
    nativeToken: eth[ChainId.SEPOLIA],
  },
  [ChainId.ARBITRUM_ONE]: {
    name: 'Arbitrum One',
    iconSrc: iconSrcs.arbitrumOne,
    explorerUrl: 'https://arbiscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-arbitrum.safe.global',
    corePoolComptrollerContractAddress: '0x317c1A5739F39046E20b08ac9BeEa3f10fD43326',
    nativeToken: eth[ChainId.ARBITRUM_ONE],
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    name: 'Arbitrum Sepolia',
    iconSrc: iconSrcs.arbitrumOne,
    explorerUrl: 'https://sepolia.arbiscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x006D44b6f5927b3eD83bD0c1C36Fb1A3BaCaC208',
    nativeToken: eth[ChainId.ARBITRUM_SEPOLIA],
  },
  [ChainId.ZKSYNC_MAINNET]: {
    name: 'ZKsync',
    iconSrc: iconSrcs.zkSync,
    explorerUrl: 'https://explorer.zksync.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-zksync.safe.global',
    corePoolComptrollerContractAddress: '0xddE4D098D9995B659724ae6d5E3FB9681Ac941B1',
    nativeToken: eth[ChainId.ZKSYNC_MAINNET],
  },
  [ChainId.ZKSYNC_SEPOLIA]: {
    name: 'ZKsync Sepolia',
    iconSrc: iconSrcs.zkSync,
    explorerUrl: 'https://sepolia.explorer.zksync.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0xC527DE08E43aeFD759F7c0e6aE85433923064669',
    nativeToken: eth[ChainId.ZKSYNC_SEPOLIA],
  },
  [ChainId.OPTIMISM_MAINNET]: {
    name: 'Optimism',
    iconSrc: iconSrcs.optimism,
    explorerUrl: 'https://optimistic.etherscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-optimism.safe.global',
    corePoolComptrollerContractAddress: '0x5593FF68bE84C966821eEf5F0a988C285D5B7CeC',
    nativeToken: eth[ChainId.OPTIMISM_MAINNET],
  },
  [ChainId.OPTIMISM_SEPOLIA]: {
    name: 'Optimism Sepolia',
    iconSrc: iconSrcs.optimism,
    explorerUrl: 'https://sepolia-optimism.etherscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x59d10988974223B042767aaBFb6D926863069535',
    nativeToken: eth[ChainId.OPTIMISM_SEPOLIA],
  },
  [ChainId.BASE_MAINNET]: {
    name: 'Base',
    iconSrc: iconSrcs.base,
    explorerUrl: 'https://basescan.org',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-base.safe.global',
    corePoolComptrollerContractAddress: '0x0C7973F9598AA62f9e03B94E92C967fD5437426C',
    nativeToken: eth[ChainId.BASE_MAINNET],
  },
  [ChainId.BASE_SEPOLIA]: {
    name: 'Base Sepolia',
    iconSrc: iconSrcs.base,
    explorerUrl: 'https://sepolia.basescan.org',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    safeWalletApiUrl: 'https://safe-transaction-base-sepolia.safe.global',
    corePoolComptrollerContractAddress: '0x272795dd6c5355CF25765F36043F34014454Eb5b',
    nativeToken: eth[ChainId.BASE_SEPOLIA],
  },
  [ChainId.UNICHAIN_MAINNET]: {
    name: 'Unichain',
    iconSrc: iconSrcs.unichain,
    explorerUrl: 'https://uniscan.xyz',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    corePoolComptrollerContractAddress: '0xe22af1e6b78318e1Fe1053Edbd7209b8Fc62c4Fe',
    nativeToken: eth[ChainId.UNICHAIN_MAINNET],
  },
  [ChainId.UNICHAIN_SEPOLIA]: {
    name: 'Unichain Sepolia',
    iconSrc: iconSrcs.unichain,
    explorerUrl: 'https://sepolia.uniscan.xyz',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0xFeD3eAA668a6179c9E5E1A84e3A7d6883F06f7c1',
    nativeToken: eth[ChainId.UNICHAIN_SEPOLIA],
  },
};
