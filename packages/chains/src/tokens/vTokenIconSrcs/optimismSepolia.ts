import isolatedPoolsOptimismSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/opsepolia_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vOP_Core.toLowerCase()]:
    iconSrcs.vOpCore,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    iconSrcs.vWBnbCore,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    iconSrcs.vWethCore,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    iconSrcs.vUsdcCore,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    iconSrcs.vUsdtCore,
};
