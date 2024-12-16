import { ChainId } from '__mocks__/models/chains';
import { isolatedPool, legacyCorePool } from '__mocks__/models/pools';
import { bnb, eth } from '__mocks__/models/tokens';
export { ChainId } from '__mocks__/models/chains';

export const chainMetadata = {
  [ChainId.BSC_MAINNET]: {
    name: 'BNB Chain',
    logoSrc: 'fake-logo-src-bsc-mainnet',
    explorerUrl: 'https://bscscan.com',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    blockTimeMs: 3000,
    blocksPerDay: 28800,
    corePoolComptrollerContractAddress: legacyCorePool.comptrollerAddress,
    nativeToken: bnb,
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BNB testnet',
    logoSrc: 'fake-logo-src-bsc-testnet',
    explorerUrl: 'https://testnet.bscscan.com',
    layerZeroScanUrl: 'https://testnet.layerzeroscan.com',
    blockTimeMs: 3000,
    blocksPerDay: 28800,
    corePoolComptrollerContractAddress: legacyCorePool.comptrollerAddress,
    nativeToken: bnb,
  },
  [ChainId.ETHEREUM]: {
    name: 'Ethereum',
    logoSrc: 'fake-logo-src-bsc-ethereum',
    explorerUrl: 'https://etherscan.io',
    layerZeroScanUrl: 'https://layerzeroscan.com',
    blockTimeMs: 12000,
    blocksPerDay: 7200,
    corePoolComptrollerContractAddress: isolatedPool.comptrollerAddress,
    lstPoolComptrollerContractAddress: '0xF522cd0360EF8c2FF48B648d53EA1717Ec0F3Ac3',
    lstPoolVWstEthContractAddress: '0x4a240F0ee138697726C8a3E43eFE6Ac3593432CB',
    nativeToken: eth,
  },
};
