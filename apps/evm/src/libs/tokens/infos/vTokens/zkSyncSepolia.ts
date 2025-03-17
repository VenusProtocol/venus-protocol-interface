import vUsdcBridgedCoreLogo from 'libs/tokens/img/vTokens/vUsdcBridgedCore.svg';
import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
import vWBnbCoreLogo from 'libs/tokens/img/vTokens/vWBtcCore.svg';
import vWUsdmLogo from 'libs/tokens/img/vTokens/vWUsdm.svg';
import vWEthCoreLogo from 'libs/tokens/img/vTokens/vWethCore.svg';
import vZkCoreLogo from 'libs/tokens/img/vTokens/vZkCore.svg';

import isolatedPoolsZkSyncSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/zksyncsepolia_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]: vWBnbCoreLogo,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: vWEthCoreLogo,
  // has a special logo to indicate that the token is bridged to ZKsync
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    vUsdcBridgedCoreLogo,
  // USDC.e shares the usual vUSDC logo
  [isolatedPoolsZkSyncSepoliaDeployments.addresses['VToken_vUSDC.e_Core'].toLowerCase()]:
    vUsdcCoreLogo,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]: vUsdtCoreLogo,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vZK_Core.toLowerCase()]: vZkCoreLogo,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vwUSDM_Core.toLowerCase()]: vWUsdmLogo,
};
