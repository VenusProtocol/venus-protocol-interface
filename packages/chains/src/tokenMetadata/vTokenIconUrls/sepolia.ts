import isolatedPoolsSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/sepolia_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vDAI_Core.toLowerCase()]:
    tokenIconUrls.vDaiCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vFRAX_Core.toLowerCase()]:
    tokenIconUrls.vFraxCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vLBTC_Core.toLowerCase()]:
    tokenIconUrls.vLBtcCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vTUSD_Core.toLowerCase()]:
    tokenIconUrls.vTusdCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    tokenIconUrls.vUsdcCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    tokenIconUrls.vUsdtCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    tokenIconUrls.vWBtcCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    tokenIconUrls.vWethCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vsFRAX_Core.toLowerCase()]:
    tokenIconUrls.vSFraxCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vcrvUSD_Core.toLowerCase()]:
    tokenIconUrls.vCrvUsdCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_veBTC.toLowerCase()]: tokenIconUrls.vEBtcCore,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vEIGEN.toLowerCase()]: tokenIconUrls.vEigenCore,

  // Liquid Staked ETH
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWeEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vezETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vEzEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vrsETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vRsEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWeEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vweETHs_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWeEthSLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vpufETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vPufEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWstEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vsfrxETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vSfrxEthLsEth,
  [isolatedPoolsSepoliaDeployments.addresses[
    'VToken_vPT-weETH-26DEC2024_LiquidStakedETH'
  ].toLowerCase()]: tokenIconUrls.vPtWeethDec24LsEth,

  // Curve
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vCRV_Curve.toLowerCase()]:
    tokenIconUrls.vCrvCurve,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vcrvUSD_Curve.toLowerCase()]:
    tokenIconUrls.vCrvUsdCurve,
};
