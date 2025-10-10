import isolatedPoolsEthereumDeployments from '@venusprotocol/isolated-pools/deployments/ethereum_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsEthereumDeployments.addresses.VToken_vDAI_Core.toLowerCase()]: iconSrcs.vDaiCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vFRAX_Core.toLowerCase()]: iconSrcs.vFraxCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vLBTC_Core.toLowerCase()]: iconSrcs.vLBtcCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vTUSD_Core.toLowerCase()]: iconSrcs.vTusdCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]: iconSrcs.vUsdcCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]: iconSrcs.vUsdtCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]: iconSrcs.vWBtcCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: iconSrcs.vWethCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vsFRAX_Core.toLowerCase()]:
    iconSrcs.vSFraxCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vcrvUSD_Core.toLowerCase()]:
    iconSrcs.vCrvUsdCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_veBTC_Core.toLowerCase()]: iconSrcs.vEBtcCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vEIGEN_Core.toLowerCase()]:
    iconSrcs.vEigenCore,

  // Liquid Staked ETH
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWeEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vezETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vEzEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vrsETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vRsEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWeEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vweETHs_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWeEthSLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vpufETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vPufEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWstEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vsfrxETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vSfrxEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses[
    'VToken_vPT-weETH-26DEC2024_LiquidStakedETH'
  ].toLowerCase()]: iconSrcs.vPtWeethDec24LsEth,

  // Curve
  [isolatedPoolsEthereumDeployments.addresses.VToken_vCRV_Curve.toLowerCase()]: iconSrcs.vCrvCurve,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vcrvUSD_Curve.toLowerCase()]:
    iconSrcs.vCrvUsdCurve,
};
