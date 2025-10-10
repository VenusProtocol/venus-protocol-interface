import isolatedPoolsSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/sepolia_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vDAI_Core.toLowerCase()]: iconSrcs.vDaiCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vFRAX_Core.toLowerCase()]: iconSrcs.vFraxCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vLBTC_Core.toLowerCase()]: iconSrcs.vLBtcCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vTUSD_Core.toLowerCase()]: iconSrcs.vTusdCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]: iconSrcs.vUsdcCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]: iconSrcs.vUsdtCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]: iconSrcs.vWBtcCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: iconSrcs.vWethCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vsFRAX_Core.toLowerCase()]: iconSrcs.vSFraxCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vcrvUSD_Core.toLowerCase()]:
    iconSrcs.vCrvUsdCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_veBTC.toLowerCase()]: iconSrcs.vEBtcCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vEIGEN.toLowerCase()]: iconSrcs.vEigenCore,

  // Liquid Staked ETH
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWeEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vezETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vEzEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vrsETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vRsEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWeEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vweETHs_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWeEthSLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vpufETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vPufEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWstEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vsfrxETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vSfrxEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses[
    'VToken_vPT-weETH-26DEC2024_LiquidStakedETH'
  ].toLowerCase()]: iconSrcs.vPtWeethDec24LsEth,

  // Curve
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vCRV_Curve.toLowerCase()]: iconSrcs.vCrvCurve,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vcrvUSD_Curve.toLowerCase()]:
    iconSrcs.vCrvUsdCurve,
};
