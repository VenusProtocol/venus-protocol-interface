import isolatedPoolsBaseDeployments from '@venusprotocol/isolated-pools/deployments/basemainnet_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsBaseDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: iconSrcs.vWethCore,
  [isolatedPoolsBaseDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]: iconSrcs.vUsdcCore,
  [isolatedPoolsBaseDeployments.addresses.VToken_vcbBTC_Core.toLowerCase()]: iconSrcs.vCbBtcCore,
};
