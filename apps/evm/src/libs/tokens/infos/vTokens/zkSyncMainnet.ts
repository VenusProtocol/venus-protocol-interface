import vUsdcBridgedCoreLogo from 'libs/tokens/img/vTokens/vUsdcBridgedCore.svg';
import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
import vWBnbCoreLogo from 'libs/tokens/img/vTokens/vWBtcCore.svg';
import vWUsdmLogo from 'libs/tokens/img/vTokens/vWUsdm.svg';
import vWEthCoreLogo from 'libs/tokens/img/vTokens/vWethCore.svg';
import vZkCoreLogo from 'libs/tokens/img/vTokens/vZkCore.svg';

import isolatedPoolsZkSyncMainnetDeployments from '@venusprotocol/isolated-pools/deployments/zksyncmainnet_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]: vWBnbCoreLogo,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: vWEthCoreLogo,
  // has a special logo to indicate that the token is bridged to zkSync
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    vUsdcBridgedCoreLogo,
  // USDC.e shares the usual vUSDC logo
  [isolatedPoolsZkSyncMainnetDeployments.addresses['VToken_vUSDC.e_Core'].toLowerCase()]:
    vUsdcCoreLogo,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]: vUsdtCoreLogo,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vZK_Core.toLowerCase()]: vZkCoreLogo,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vwUSDM_Core.toLowerCase()]: vWUsdmLogo,
};
