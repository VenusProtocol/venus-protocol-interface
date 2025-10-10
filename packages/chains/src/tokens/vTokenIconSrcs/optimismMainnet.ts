import isolatedPoolsOptimismMainnetDeployments from '@venusprotocol/isolated-pools/deployments/opmainnet_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsOptimismMainnetDeployments.addresses.VToken_vOP_Core.toLowerCase()]:
    iconSrcs.vOpCore,
  [isolatedPoolsOptimismMainnetDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    iconSrcs.vWBnbCore,
  [isolatedPoolsOptimismMainnetDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    iconSrcs.vWethCore,
  [isolatedPoolsOptimismMainnetDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    iconSrcs.vUsdcCore,
  [isolatedPoolsOptimismMainnetDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    iconSrcs.vUsdtCore,
};
