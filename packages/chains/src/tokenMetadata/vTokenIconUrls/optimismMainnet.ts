import isolatedPoolsOptimismMainnetDeployments from '@venusprotocol/isolated-pools/deployments/opmainnet_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsOptimismMainnetDeployments.addresses.VToken_vOP_Core.toLowerCase()]:
    tokenIconUrls.vOpCore,
  [isolatedPoolsOptimismMainnetDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    tokenIconUrls.vWBnbCore,
  [isolatedPoolsOptimismMainnetDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    tokenIconUrls.vWethCore,
  [isolatedPoolsOptimismMainnetDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    tokenIconUrls.vUsdcCore,
  [isolatedPoolsOptimismMainnetDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    tokenIconUrls.vUsdtCore,
};
