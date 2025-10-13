import isolatedPoolsBaseSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/basesepolia_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsBaseSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    iconSrcs.vWethCore,
  [isolatedPoolsBaseSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    iconSrcs.vUsdcCore,
  [isolatedPoolsBaseSepoliaDeployments.addresses.VToken_vcbBTC_Core.toLowerCase()]:
    iconSrcs.vCbBtcCore,
};
