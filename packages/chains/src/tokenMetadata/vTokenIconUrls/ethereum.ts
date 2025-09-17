import isolatedPoolsEthereumDeployments from '@venusprotocol/isolated-pools/deployments/ethereum_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsEthereumDeployments.addresses.VToken_vDAI_Core.toLowerCase()]:
    tokenIconUrls.vDaiCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vFRAX_Core.toLowerCase()]:
    tokenIconUrls.vFraxCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vLBTC_Core.toLowerCase()]:
    tokenIconUrls.vLBtcCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vTUSD_Core.toLowerCase()]:
    tokenIconUrls.vTusdCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    tokenIconUrls.vUsdcCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    tokenIconUrls.vUsdtCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    tokenIconUrls.vWBtcCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    tokenIconUrls.vWethCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vsFRAX_Core.toLowerCase()]:
    tokenIconUrls.vSFraxCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vcrvUSD_Core.toLowerCase()]:
    tokenIconUrls.vCrvUsdCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_veBTC_Core.toLowerCase()]:
    tokenIconUrls.vEBtcCore,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vEIGEN_Core.toLowerCase()]:
    tokenIconUrls.vEigenCore,

  // Liquid Staked ETH
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWeEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vezETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vEzEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vrsETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vRsEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWeEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vweETHs_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWeEthSLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vpufETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vPufEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWstEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vsfrxETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vSfrxEthLsEth,
  [isolatedPoolsEthereumDeployments.addresses[
    'VToken_vPT-weETH-26DEC2024_LiquidStakedETH'
  ].toLowerCase()]: tokenIconUrls.vPtWeethDec24LsEth,

  // Curve
  [isolatedPoolsEthereumDeployments.addresses.VToken_vCRV_Curve.toLowerCase()]:
    tokenIconUrls.vCrvCurve,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vcrvUSD_Curve.toLowerCase()]:
    tokenIconUrls.vCrvUsdCurve,
};
