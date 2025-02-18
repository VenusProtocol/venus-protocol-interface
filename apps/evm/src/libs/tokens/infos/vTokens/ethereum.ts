import vCrvUsdCoreLogo from 'libs/tokens/img/vTokens/vCrvUsdCore.png';
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
import vPufEthLsEthLogo from 'libs/tokens/img/vTokens/vPufEthLsEth.png';
import vRsEthLsEthLogo from 'libs/tokens/img/vTokens/vRsEthLsEth.svg';
import vSfrxEthLsEthLogo from 'libs/tokens/img/vTokens/vSfrxEthLsEth.svg';
import vWeEthLsEthLogo from 'libs/tokens/img/vTokens/vWeEthLsEth.svg';
import vWeEthSLsEthLogo from 'libs/tokens/img/vTokens/vWeEthSLsEth.svg';
import vWEthLsEthLogo from 'libs/tokens/img/vTokens/vWethLsEth.svg';
import vWstEthLsEthLogo from 'libs/tokens/img/vTokens/vWstEthLsEth.svg';

import vCrvCurveLogo from 'libs/tokens/img/vTokens/vCrvCurve.png';
import vCrvUsdCurveLogo from 'libs/tokens/img/vTokens/vCrvUsdCurve.png';

import isolatedPoolsEthereumDeployments from '@venusprotocol/isolated-pools/deployments/ethereum_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsEthereumDeployments.addresses.VToken_vDAI_Core.toLowerCase()]: vDaiCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vFRAX_Core.toLowerCase()]: vFraxCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vLBTC_Core.toLowerCase()]: vLbtcCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vTUSD_Core.toLowerCase()]: vTusdCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]: vUsdcCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]: vUsdtCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]: vWBtcCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: vWEthCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vsFRAX_Core.toLowerCase()]: vSFraxCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vcrvUSD_Core.toLowerCase()]: vCrvUsdCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_veBTC_Core.toLowerCase()]: vEBtcCoreLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vEIGEN_Core.toLowerCase()]: vEigenCoreLogo,

  // Liquid Staked ETH
  [isolatedPoolsEthereumDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    vWEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vezETH_LiquidStakedETH.toLowerCase()]:
    vEzEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vrsETH_LiquidStakedETH.toLowerCase()]:
    vRsEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    vWeEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vweETHs_LiquidStakedETH.toLowerCase()]:
    vWeEthSLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vpufETH_LiquidStakedETH.toLowerCase()]:
    vPufEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    vWstEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vsfrxETH_LiquidStakedETH.toLowerCase()]:
    vSfrxEthLsEthLogo,
  [isolatedPoolsEthereumDeployments.addresses[
    'VToken_vPT-weETH-26DEC2024_LiquidStakedETH'
  ].toLowerCase()]: vPtWeethDec24LsEthLogo,

  // Curve
  [isolatedPoolsEthereumDeployments.addresses.VToken_vCRV_Curve.toLowerCase()]: vCrvCurveLogo,
  [isolatedPoolsEthereumDeployments.addresses.VToken_vcrvUSD_Curve.toLowerCase()]: vCrvUsdCurveLogo,
};
