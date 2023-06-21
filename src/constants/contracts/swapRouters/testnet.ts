import { SwapRouterAddressMapping } from 'types';
import { getContractAddress } from 'utilities';

const MAIN_POOL_COMPTROLLER_ADDRESS = getContractAddress('comptroller').toLowerCase();

export const TESTNET_SWAP_ROUTERS: SwapRouterAddressMapping = {
  // Main pool
  [MAIN_POOL_COMPTROLLER_ADDRESS]: '0x83edf1dee1b730b7e8e13c00ba76027d63a51ac0',
  // Isolated pools
  '0xf320d8cb33e08805e9798ea0d38d65b91b9d00cd': '0x7dcbd10e3479907e0b8c79d01d0572c8cc00227b',
  '0x5bce7102339b3865ba7cea8602d5b61db9980827': '0x76b88ff4579b35d2722b7383b9b9ce831dc89b72',
  '0x605aa769d14f6af2e405295fec2a4d8baa623d80': '0x6ce131c2321e25d7b4c63283b75db160ce3fb710',
  '0xd39b346f2d8feffaeebdd790ca24ee3a60d20519': '0x51fd03ad1132e8cb5a5a793528c9f4ec918667d4',
  '0xee25be03d7f41f3cf497d102b8c3df0bfea974e3': '0xfdebf4530f9c7d352fffe88cd0e96c8bb7391bd9',
};
