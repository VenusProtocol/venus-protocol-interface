import isolatedPoolsUnichainSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/unichainsepolia_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    iconSrcs.vWethCore,
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    iconSrcs.vUsdcCore,
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    iconSrcs.vUsdtCore,
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vcbBTC_Core.toLowerCase()]:
    iconSrcs.vCbBtcCore,
};
