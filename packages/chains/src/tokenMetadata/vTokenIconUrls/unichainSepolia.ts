import isolatedPoolsUnichainSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/unichainsepolia_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    tokenIconUrls.vWethCore,
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    tokenIconUrls.vUsdcCore,
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    tokenIconUrls.vUsdtCore,
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vcbBTC_Core.toLowerCase()]:
    tokenIconUrls.vCbBtcCore,
};
