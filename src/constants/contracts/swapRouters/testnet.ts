import { SwapRouterAddressMapping } from 'types';
import { getContractAddress } from 'utilities';

const MAIN_POOL_COMPTROLLER_ADDRESS = getContractAddress('comptroller').toLowerCase();

export const TESTNET_SWAP_ROUTERS: SwapRouterAddressMapping = {
  // Main pool
  [MAIN_POOL_COMPTROLLER_ADDRESS]: '0x83edf1dee1b730b7e8e13c00ba76027d63a51ac0',
  // Isolated pools
  '0x10b57706ad2345e590c2ea4dc02faef0d9f5b08b': '0xCA59D9e8889Bc6034CCD749c4Ddd09c865432bA8',
};
