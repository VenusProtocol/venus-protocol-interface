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
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vDAI_Core]: vDaiCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vFRAX_Core]: vFraxCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vLBTC_Core]: vLbtcCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vTUSD_Core]: vTusdCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vUSDC_Core]: vUsdcCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vUSDT_Core]: vUsdtCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWBTC_Core]: vWBtcCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWETH_Core]: vWEthCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vsFRAX_Core]: vSFraxCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vcrvUSD_Core]: vCrvUsdCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_veBTC]: vEBtcCoreLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vEIGEN]: vEigenCoreLogo,

  // Liquid Staked ETH
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vWETH_LiquidStakedETH]: vWEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vezETH_LiquidStakedETH]: vEzEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vrsETH_LiquidStakedETH]: vRsEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vweETH_LiquidStakedETH]: vWeEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vweETHs_LiquidStakedETH]: vWeEthSLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vpufETH_LiquidStakedETH]: vPufEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vwstETH_LiquidStakedETH]: vWstEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vsfrxETH_LiquidStakedETH]: vSfrxEthLsEthLogo,
  [isolatedPoolsSepoliaDeployments.addresses['VToken_vPT-weETH-26DEC2024_LiquidStakedETH']]:
    vPtWeethDec24LsEthLogo,

  // Curve
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vCRV_Curve]: vCrvCurveLogo,
  [isolatedPoolsSepoliaDeployments.addresses.VToken_vcrvUSD_Curve]: vCrvUsdCurveLogo,
};
