import isolatedPoolsArbitrumSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/arbitrumsepolia_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vARB_Core.toLowerCase()]:
    iconSrcs.vArbCore,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    iconSrcs.vWBtcCore,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    iconSrcs.vWethCore,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    iconSrcs.vUsdcCore,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    iconSrcs.vUsdtCore,

  // LS ETH
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWethLsEth,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWeEthLsEth,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWstEthLsEth,
};
