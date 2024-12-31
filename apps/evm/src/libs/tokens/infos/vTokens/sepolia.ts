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

import isolatedPoolsSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/sepolia_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vDAI_Core.toLowerCase()]: vDaiCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vFRAX_Core.toLowerCase()]: vFraxCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vLBTC_Core.toLowerCase()]: vLbtcCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vTUSD_Core.toLowerCase()]: vTusdCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]: vUsdcCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]: vUsdtCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]: vWBtcCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: vWEthCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vsFRAX_Core.toLowerCase()]: vSFraxCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vcrvUSD_Core.toLowerCase()]: vCrvUsdCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_veBTC.toLowerCase()]: vEBtcCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vEIGEN.toLowerCase()]: vEigenCoreLogo,

  // Liquid Staked ETH
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    vWEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vezETH_LiquidStakedETH.toLowerCase()]:
    vEzEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vrsETH_LiquidStakedETH.toLowerCase()]:
    vRsEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    vWeEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vweETHs_LiquidStakedETH.toLowerCase()]:
    vWeEthSLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vpufETH_LiquidStakedETH.toLowerCase()]:
    vPufEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    vWstEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vsfrxETH_LiquidStakedETH.toLowerCase()]:
    vSfrxEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses[
    'VToken_vPT-weETH-26DEC2024_LiquidStakedETH'
  ].toLowerCase()]: vPtWeethDec24LsEthLogo,

  // Curve
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vCRV_Curve.toLowerCase()]: vCrvCurveLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vcrvUSD_Curve.toLowerCase()]: vCrvUsdCurveLogo,
};
