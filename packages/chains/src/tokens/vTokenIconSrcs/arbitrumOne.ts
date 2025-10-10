import isolatedPoolsArbitrumOneDeployments from '@venusprotocol/isolated-pools/deployments/arbitrumone_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vARB_Core.toLowerCase()]: iconSrcs.vArbCore,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    iconSrcs.vWBtcCore,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    iconSrcs.vWethCore,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    iconSrcs.vUsdcCore,

  // LS ETH
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWethLsEth,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWeEthLsEth,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWstEthLsEth,
};
