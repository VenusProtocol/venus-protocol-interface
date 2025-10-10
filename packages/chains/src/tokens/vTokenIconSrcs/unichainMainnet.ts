import isolatedPoolsUnichainMainnetDeployments from '@venusprotocol/isolated-pools/deployments/unichainmainnet_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsUnichainMainnetDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    iconSrcs.vWethCore,
  [isolatedPoolsUnichainMainnetDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    iconSrcs.vUsdcCore,
};
