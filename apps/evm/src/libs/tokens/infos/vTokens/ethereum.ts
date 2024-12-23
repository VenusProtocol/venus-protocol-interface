import vCrvUsdCoreLogo from 'libs/tokens/img/vTokens/vCrvUsdCore.svg';
import vDaiCoreLogo from 'libs/tokens/img/vTokens/vDaiCore.svg';
import vEBtcCoreLogo from 'libs/tokens/img/vTokens/vEBtcCore.svg';
import vEigenCoreLogo from 'libs/tokens/img/vTokens/vEigenCore.svg';
import vFraxCoreLogo from 'libs/tokens/img/vTokens/vFraxCore.svg';
import vLbtcCoreLogo from 'libs/tokens/img/vTokens/vLBtcCore.svg';
import vSFraxCoreLogo from 'libs/tokens/img/vTokens/vSFraxCore.svg';
import vTusdCoreLogo from 'libs/tokens/img/vTokens/vTusdCore.svg';
import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
import vWBtcCoreLogo from 'libs/tokens/img/vTokens/vWBtcCore.svg';
import vWEthCoreLogo from 'libs/tokens/img/vTokens/vWethCore.svg';

import vEzEthLsEthLogo from 'libs/tokens/img/vTokens/vEzEthLsEth.svg';
import vPtWeethDec24LsEthLogo from 'libs/tokens/img/vTokens/vPtWeethDec24LsEth.svg';
import vPufEthLsEthLogo from 'libs/tokens/img/vTokens/vPufEthLsEth.svg';
import vRsEthLsEthLogo from 'libs/tokens/img/vTokens/vRsEthLsEth.svg';
import vSfrxEthLsEthLogo from 'libs/tokens/img/vTokens/vSfrxEthLsEth.svg';
import vWeEthLsEthLogo from 'libs/tokens/img/vTokens/vWeEthLsEth.svg';
import vWeEthSLsEthLogo from 'libs/tokens/img/vTokens/vWeEthSLsEth.svg';
import vWEthLsEthLogo from 'libs/tokens/img/vTokens/vWethLsEth.svg';
import vWstEthLsEthLogo from 'libs/tokens/img/vTokens/vWstEthLsEth.svg';

import vCrvCurveLogo from 'libs/tokens/img/vTokens/vCrvCurve.svg';
import vCrvUsdCurveLogo from 'libs/tokens/img/vTokens/vCrvUsdCurve.svg';

import isolatedPoolsEthereumDeployments from '@venusprotocol/isolated-pools/deployments/ethereum_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsEthereumDeployments.addresses.VToken_vDAI_Core]: vDaiCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vFRAX_Core]: vFraxCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vLBTC_Core]: vLbtcCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vTUSD_Core]: vTusdCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vUSDC_Core]: vUsdcCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vUSDT_Core]: vUsdtCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWBTC_Core]: vWBtcCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWETH_Core]: vWEthCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vsFRAX_Core]: vSFraxCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vcrvUSD_Core]: vCrvUsdCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_veBTC]: vEBtcCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vEIGEN]: vEigenCoreLogo,

  // Liquid Staked ETH
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWETH_LiquidStakedETH]: vWEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vezETH_LiquidStakedETH]: vEzEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vrsETH_LiquidStakedETH]: vRsEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vweETH_LiquidStakedETH]: vWeEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vweETHs_LiquidStakedETH]: vWeEthSLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vpufETH_LiquidStakedETH]: vPufEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vwstETH_LiquidStakedETH]: vWstEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vsfrxETH_LiquidStakedETH]: vSfrxEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses['VToken_vPT-weETH-26DEC2024_LiquidStakedETH']]:
    vPtWeethDec24LsEthLogo,

  // Curve
  [isolatedPoolsEthereumDeployments.addresses.VToken_vCRV_Curve]: vCrvCurveLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vcrvUSD_Curve]: vCrvUsdCurveLogo,
};
