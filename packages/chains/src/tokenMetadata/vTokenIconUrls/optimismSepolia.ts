import isolatedPoolsOptimismSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/opsepolia_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vOP_Core.toLowerCase()]:
    tokenIconUrls.vOpCore,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    tokenIconUrls.vWBnbCore,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    tokenIconUrls.vWethCore,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    tokenIconUrls.vUsdcCore,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    tokenIconUrls.vUsdtCore,
};
