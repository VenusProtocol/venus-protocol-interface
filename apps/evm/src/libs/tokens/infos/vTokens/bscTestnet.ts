// import vAaveCoreLogo from 'libs/tokens/img/vTokens/vAaveCore.svg';
// import vAdaCoreLogo from 'libs/tokens/img/vTokens/vAdaCore.svg';
// import vBchCoreLogo from 'libs/tokens/img/vTokens/vBchCore.svg';
// import vBethCoreLogo from 'libs/tokens/img/vTokens/vBethCore.svg';
import vBnbCoreLogo from 'libs/tokens/img/vTokens/vBnbCore.svg';
import vBusdCoreLogo from 'libs/tokens/img/vTokens/vBusdCore.svg';
// import vCakeCoreLogo from 'libs/tokens/img/vTokens/vCakeCore.svg';
// import vDaiCoreLogo from 'libs/tokens/img/vTokens/vDaiCore.svg';
// import vDogeCoreLogo from 'libs/tokens/img/vTokens/vDogeCore.svg';
// import vDotCoreLogo from 'libs/tokens/img/vTokens/vDotCore.svg';
import vEthCoreLogo from 'libs/tokens/img/vTokens/vEthCore.svg';
import vFDUsdCoreLogo from 'libs/tokens/img/vTokens/vFDUsdCore.svg';
// import vFilCoreLogo from 'libs/tokens/img/vTokens/vFilCore.svg';
// import vLinkCoreLogo from 'libs/tokens/img/vTokens/vLinkCore.svg';
import vLtcCoreLogo from 'libs/tokens/img/vTokens/vLtcCore.svg';
// import vLunaCoreLogo from 'libs/tokens/img/vTokens/vLunaCore.svg';
// import vMaticCoreLogo from 'libs/tokens/img/vTokens/vMaticCore.svg';
import vSxpCoreLogo from 'libs/tokens/img/vTokens/vSxpCore.svg';
import vTrxCoreLogo from 'libs/tokens/img/vTokens/vTrxCore.svg';
import vTusdCoreLogo from 'libs/tokens/img/vTokens/vTusdCore.svg';
import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
// import vUstCoreLogo from 'libs/tokens/img/vTokens/vUstCore.svg';
import vWBethCoreLogo from 'libs/tokens/img/vTokens/vWBethCore.svg';
import vXvsCoreLogo from 'libs/tokens/img/vTokens/vXvsCore.svg';
import vXrpCoreLogo from 'libs/tokens/img/vTokens/xXrpCore.svg';

// Defi
import vAlpacaDefiLogo from 'libs/tokens/img/vTokens/vAlpacaDefi.svg';
import vAnkrBnbDefiLogo from 'libs/tokens/img/vTokens/vAnkrBnbDefi.svg';
import vAnkrDefiLogo from 'libs/tokens/img/vTokens/vAnkrDefi.svg';
import vBswDefiLogo from 'libs/tokens/img/vTokens/vBswDefi.svg';
import vPlanetDefiLogo from 'libs/tokens/img/vTokens/vPlanetDefi.svg';
import vTwtDefiLogo from 'libs/tokens/img/vTokens/vTwtDefi.svg';
import vUsddDefiLogo from 'libs/tokens/img/vTokens/vUsddDefi.svg';
import vUsdtDefiLogo from 'libs/tokens/img/vTokens/vUsdtDefi.svg';

// Stablecoins
import vEuraStablecoinsLogo from 'libs/tokens/img/vTokens/vEuraStablecoins.svg';
// import vUsddStablecoinsLogo from 'libs/tokens/img/vTokens/vUsddStablecoins.svg';
// import vUsdtStablecoinsLogo from 'libs/tokens/img/vTokens/vUsdtStablecoins.svg';

// Meme
import vBabyDogeMemeLogo from 'libs/tokens/img/vTokens/vBabyDogeMeme.svg';
import vUsdtMemeLogo from 'libs/tokens/img/vTokens/vUsdtMeme.svg';

// Gamefi
import vFlokiGamefiLogo from 'libs/tokens/img/vTokens/vFlokiGamefi.svg';
import vRacaGamefiLogo from 'libs/tokens/img/vTokens/vRacaGamefi.svg';
import vUsddGamefiLogo from 'libs/tokens/img/vTokens/vUsddGamefi.svg';
import vUsdtGamefiLogo from 'libs/tokens/img/vTokens/vUsdtGamefi.svg';

// LS BNB
import vAnkrBnbLsBnbLogo from 'libs/tokens/img/vTokens/vAnkrBnbLsBnb.svg';
import vBnbXLsBnbLogo from 'libs/tokens/img/vTokens/vBnbXLsBnb.svg';
import vSlisBnbLsBnbLogo from 'libs/tokens/img/vTokens/vSlisBnbLsBnb.svg';
import vStkBnbLsBnbLogo from 'libs/tokens/img/vTokens/vStkBnbLsBnb.svg';

// LS ETH
import vEthLsEthLogo from 'libs/tokens/img/vTokens/vEthLsEth.svg';
import vWEthLsEthLogo from 'libs/tokens/img/vTokens/vWethLsEth.svg';
import vWstEthLsEthLogo from 'libs/tokens/img/vTokens/vWstEthLsEth.svg';

// Tron
import vBttTronLogo from 'libs/tokens/img/vTokens/vBttTron.svg';
import vTrxTronLogo from 'libs/tokens/img/vTokens/vTrxTron.svg';
import vUsddTronLogo from 'libs/tokens/img/vTokens/vUsddTron.svg';
import vUsdtTronLogo from 'libs/tokens/img/vTokens/vUsdtTron.svg';
import vWinTronLogo from 'libs/tokens/img/vTokens/vWinTron.svg';

import isolatedPoolsBscTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet_addresses.json';
import venusProtocolBscTestnetDeployments from '@venusprotocol/venus-protocol/deployments/bsctestnet_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  // [venusProtocolBscTestnetDeployments.addresses.vAAVE.toLowerCase()]: vAaveCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vADA.toLowerCase()]: vAdaCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vBCH.toLowerCase()]: vBchCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vBETH.toLowerCase()]: vBethCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vBNB.toLowerCase()]: vBnbCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vBUSD.toLowerCase()]: vBusdCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vCAKE.toLowerCase()]: vCakeCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vDAI.toLowerCase()]: vDaiCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vDOGE.toLowerCase()]: vDogeCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vDOT.toLowerCase()]: vDotCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vETH.toLowerCase()]: vEthCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vFDUSD.toLowerCase()]: vFDUsdCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vFIL.toLowerCase()]: vFilCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vLINK.toLowerCase()]: vLinkCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vLTC.toLowerCase()]: vLtcCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vLUNA.toLowerCase()]: vLunaCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vMATIC.toLowerCase()]: vMaticCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vSXP.toLowerCase()]: vSxpCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vTRX.toLowerCase()]: vTrxCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vTRXOLD.toLowerCase()]: vTrxCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vTUSD.toLowerCase()]: vTusdCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vTUSDOLD.toLowerCase()]: vTusdCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vUSDC.toLowerCase()]: vUsdcCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vUSDT.toLowerCase()]: vUsdtCoreLogo,
  // [venusProtocolBscTestnetDeployments.addresses.vUST.toLowerCase()]: vUstCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vWBETH.toLowerCase()]: vWBethCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vXRP.toLowerCase()]: vXrpCoreLogo,
  [venusProtocolBscTestnetDeployments.addresses.vXVS.toLowerCase()]: vXvsCoreLogo,
  // Defi pool
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vALPACA_DeFi.toLowerCase()]: vAlpacaDefiLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vANKR_DeFi.toLowerCase()]: vAnkrDefiLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vankrBNB_DeFi.toLowerCase()]:
    vAnkrBnbDefiLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBSW_DeFi.toLowerCase()]: vBswDefiLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vPLANET_DeFi.toLowerCase()]: vPlanetDefiLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vTWT_DeFi.toLowerCase()]: vTwtDefiLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDD_DeFi.toLowerCase()]: vUsddDefiLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_DeFi.toLowerCase()]: vUsdtDefiLogo,
  // Stablecoins
  // [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDD_Stablecoins.toLowerCase()]: vUsddStablecoinsLogo,
  // [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_Stablecoins.toLowerCase()]: vUsdtStablecoinsLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vEURA_Stablecoins.toLowerCase()]:
    vEuraStablecoinsLogo,
  // Meme
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBabyDoge_Meme.toLowerCase()]:
    vBabyDogeMemeLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_Meme.toLowerCase()]: vUsdtMemeLogo,
  // Gamefi
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vFLOKI_GameFi.toLowerCase()]:
    vFlokiGamefiLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vRACA_GameFi.toLowerCase()]: vRacaGamefiLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDD_GameFi.toLowerCase()]: vUsddGamefiLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_GameFi.toLowerCase()]: vUsdtGamefiLogo,
  // Liquid Staked BNB
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vankrBNB_LiquidStakedBNB.toLowerCase()]:
    vAnkrBnbLsBnbLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBNBx_LiquidStakedBNB.toLowerCase()]:
    vBnbXLsBnbLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vslisBNB_LiquidStakedBNB.toLowerCase()]:
    vSlisBnbLsBnbLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vstkBNB_LiquidStakedBNB.toLowerCase()]:
    vStkBnbLsBnbLogo,

  // Liquid Staked ETH
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vETH_LiquidStakedETH.toLowerCase()]:
    vEthLsEthLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    vWEthLsEthLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    vWstEthLsEthLogo,

  // Tron
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBTT_Tron.toLowerCase()]: vBttTronLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vTRX_Tron.toLowerCase()]: vTrxTronLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDD_Tron.toLowerCase()]: vUsddTronLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_Tron.toLowerCase()]: vUsdtTronLogo,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vWIN_Tron.toLowerCase()]: vWinTronLogo,
};
