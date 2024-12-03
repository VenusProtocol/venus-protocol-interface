import { getToken } from 'libs/tokens/utilities/getToken';
import arbitrumLogo from 'libs/wallet/img/chains/arbitrum.svg';
import bscLogo from 'libs/wallet/img/chains/bsc.svg';
import ethLogo from 'libs/wallet/img/chains/eth.svg';
import opbnbLogo from 'libs/wallet/img/chains/opbnb.svg';
import optimismLogo from 'libs/wallet/img/chains/optimism.svg';
import zkSyncLogo from 'libs/wallet/img/chains/zkSync.svg';
import { ChainId, type ChainMetadata } from 'types';

const PROPOSAL_EXECUTION_GRACE_PERIOD_MS = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

export const CHAIN_METADATA: {
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
    proposalExecutionGracePeriodMs: PROPOSAL_EXECUTION_GRACE_PERIOD_MS,
    nativeToken: getToken({ chainId: ChainId.BSC_MAINNET, symbol: 'BNB' })!,
    rpcUrl: 'https://bsc-mainnet.nodereal.io/v1/7fab7575d1c34150a9ee582167ffac6f',
    marketsSubgraphUrl:
      'https://gateway-arbitrum.network.thegraph.com/api/43fa98f50f96a8e1b63423e8ead8c6dc/deployments/id/QmVMKvBgAgnqVrLmRUurMiziH3Q55Fa5VoYJXN4TVLZgsw',
    governanceSubgraphUrl:
      'https://gateway-arbitrum.network.thegraph.com/api/43fa98f50f96a8e1b63423e8ead8c6dc/deployments/id/QmVAi2T8BptC9hjfJG8oYBT5xQQZR4x6Fnr8WjyRivkbaD',
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BNB testnet',
    logoSrc: bscLogo,
    explorerUrl: 'https://testnet.bscscan.com',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    blockTimeMs: 3000,
    blocksPerDay: 28800,
    corePoolComptrollerContractAddress: '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
    proposalExecutionGracePeriodMs: PROPOSAL_EXECUTION_GRACE_PERIOD_MS,
    nativeToken: getToken({ chainId: ChainId.BSC_TESTNET, symbol: 'BNB' })!,
    rpcUrl: 'https://bsc-testnet.nodereal.io/v1/7fab7575d1c34150a9ee582167ffac6f',
    marketsSubgraphUrl:
      'https://api.studio.thegraph.com/query/77761/venus-isolated-pools-chapel/version/latest',
    governanceSubgraphUrl:
      'https://api.studio.thegraph.com/query/64786/venus-governance-chapel/version/latest',
  },
  [ChainId.OPBNB_MAINNET]: {
    name: 'opBNB',
    logoSrc: opbnbLogo,
    explorerUrl: 'https://opbnbscan.com',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    blockTimeMs: 1000,
    blocksPerDay: 86400,
    corePoolComptrollerContractAddress: '0xD6e3E2A1d8d95caE355D15b3b9f8E5c2511874dd',
    nativeToken: getToken({ chainId: ChainId.OPBNB_MAINNET, symbol: 'BNB' })!,
    rpcUrl: 'https://opbnb-mainnet.nodereal.io/v1/7fab7575d1c34150a9ee582167ffac6f',
    marketsSubgraphUrl:
      'https://open-platform-ap.nodereal.io/7fab7575d1c34150a9ee582167ffac6f/opbnb-mainnet-graph-query/subgraphs/name/venusprotocol/venus-isolated-pools-opbnb',
  },
  [ChainId.OPBNB_TESTNET]: {
    name: 'opBNB testnet',
    logoSrc: opbnbLogo,
    explorerUrl: 'https://testnet.opbnbscan.com',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    blockTimeMs: 1000,
    blocksPerDay: 86400,
    corePoolComptrollerContractAddress: '0x2FCABb31E57F010D623D8d68e1E18Aed11d5A388',
    nativeToken: getToken({ chainId: ChainId.OPBNB_TESTNET, symbol: 'BNB' })!,
    rpcUrl: 'https://opbnb-testnet.nodereal.io/v1/7fab7575d1c34150a9ee582167ffac6f',
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
    nativeToken: getToken({ chainId: ChainId.ETHEREUM, symbol: 'ETH' })!,
    rpcUrl: 'https://eth-mainnet.nodereal.io/v1/7fab7575d1c34150a9ee582167ffac6f',
    marketsSubgraphUrl:
      'https://gateway-arbitrum.network.thegraph.com/api/43fa98f50f96a8e1b63423e8ead8c6dc/deployments/id/Qmazi4kSKzahgR5G6U7FVUoUGLQZQVPohRX6zbuxbC8YX1',
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
    nativeToken: getToken({ chainId: ChainId.SEPOLIA, symbol: 'ETH' })!,
    rpcUrl: 'https://eth-sepolia.nodereal.io/v1/7fab7575d1c34150a9ee582167ffac6f',
    marketsSubgraphUrl:
      'https://api.studio.thegraph.com/query/64786/venus-isolated-pools-sepolia/version/latest',
  },
  [ChainId.ARBITRUM_ONE]: {
    name: 'Arbitrum One',
    logoSrc: arbitrumLogo,
    explorerUrl: 'https://arbiscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x317c1A5739F39046E20b08ac9BeEa3f10fD43326',
    lstPoolComptrollerContractAddress: '0x52bAB1aF7Ff770551BD05b9FC2329a0Bf5E23F16',
    lstPoolVWstEthContractAddress: '0x9df6B5132135f14719696bBAe3C54BAb272fDb16',
    nativeToken: getToken({ chainId: ChainId.ARBITRUM_ONE, symbol: 'ETH' })!,
    rpcUrl: 'https://open-platform.nodereal.io/7fab7575d1c34150a9ee582167ffac6f/arbitrum-nitro',
    marketsSubgraphUrl:
      'https://gateway-arbitrum.network.thegraph.com/api/43fa98f50f96a8e1b63423e8ead8c6dc/deployments/id/QmQByQzsGpuVqaZcfraxQduUwMX4JpnAnFd1s1JTkSUREj',
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    name: 'Arbitrum Sepolia',
    logoSrc: arbitrumLogo,
    explorerUrl: 'https://sepolia.arbiscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x006D44b6f5927b3eD83bD0c1C36Fb1A3BaCaC208',
    lstPoolComptrollerContractAddress: '0x3D04F926b2a165BBa17FBfccCCB61513634fa5e4',
    lstPoolVWstEthContractAddress: '0x253515E19e8b888a4CA5a0a3363B712402ce4046',
    nativeToken: getToken({
      chainId: ChainId.ARBITRUM_SEPOLIA,
      symbol: 'ETH',
    })!,
    rpcUrl:
      'https://rpc.ankr.com/arbitrum_sepolia/451c00a15d3de617618d7a880cec1da8065b10906c460b1462a8b8769d91e0da',
    marketsSubgraphUrl:
      'https://api.studio.thegraph.com/query/64786/venus-il-arbitrumsepolia/version/latest',
  },
  [ChainId.ZKSYNC_SEPOLIA]: {
    name: 'zkSync Sepolia',
    logoSrc: zkSyncLogo,
    explorerUrl: 'https://sepolia.explorer.zksync.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0xC527DE08E43aeFD759F7c0e6aE85433923064669',
    nativeToken: getToken({ chainId: ChainId.ZKSYNC_SEPOLIA, symbol: 'ETH' })!,
    rpcUrl: 'https://sepolia.era.zksync.dev',
    marketsSubgraphUrl:
      'https://api.studio.thegraph.com/query/64786/venus-il-zksync-sepolia/version/latest',
  },
  [ChainId.ZKSYNC_MAINNET]: {
    name: 'zkSync',
    logoSrc: zkSyncLogo,
    explorerUrl: 'https://explorer.zksync.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    corePoolComptrollerContractAddress: '0xddE4D098D9995B659724ae6d5E3FB9681Ac941B1',
    nativeToken: getToken({ chainId: ChainId.ZKSYNC_MAINNET, symbol: 'ETH' })!,
    rpcUrl: 'https://open-platform.nodereal.io/7fab7575d1c34150a9ee582167ffac6f/zksync',
    marketsSubgraphUrl:
      'https://gateway.thegraph.com/api/43fa98f50f96a8e1b63423e8ead8c6dc/deployments/id/Qma87oPwwDfvsmBySPJQLsFKc8JXBQaJvS12MYGGku2bRG',
  },
  [ChainId.OPTIMISM_MAINNET]: {
    name: 'Optimism',
    logoSrc: optimismLogo,
    explorerUrl: 'https://optimistic.etherscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x5593FF68bE84C966821eEf5F0a988C285D5B7CeC',
    nativeToken: getToken({ chainId: ChainId.OPTIMISM_MAINNET, symbol: 'ETH' })!,
    rpcUrl: 'https://opt-mainnet.nodereal.io/v1/7fab7575d1c34150a9ee582167ffac6f',
    marketsSubgraphUrl:
      'https://gateway.thegraph.com/api/43fa98f50f96a8e1b63423e8ead8c6dc/deployments/id/QmZqvM6BRz1nNvK41SbfcafW2sbLZpnDMmubpQ5phkmPD8',
  },
  [ChainId.OPTIMISM_SEPOLIA]: {
    name: 'Optimism Sepolia',
    logoSrc: optimismLogo,
    explorerUrl: 'https://sepolia-optimism.etherscan.io',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    corePoolComptrollerContractAddress: '0x59d10988974223B042767aaBFb6D926863069535',
    nativeToken: getToken({ chainId: ChainId.OPTIMISM_SEPOLIA, symbol: 'ETH' })!,
    rpcUrl: 'https://sepolia.optimism.io',
    marketsSubgraphUrl:
      'https://gateway.testnet.thegraph.com/api/43fa98f50f96a8e1b63423e8ead8c6dc/deployments/id/QmNcLHq8xaDMhqqUFGAnafauXp4S3LAU8xAicnBMoYaB9i',
  },
};
