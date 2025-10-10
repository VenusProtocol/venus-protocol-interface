import isolatedPoolsBscMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet_addresses.json';
import venusProtocolBscMainnetDeployments from '@venusprotocol/venus-protocol/deployments/bscmainnet_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [venusProtocolBscMainnetDeployments.addresses.vAAVE.toLowerCase()]: iconSrcs.vAaveCore,
  [venusProtocolBscMainnetDeployments.addresses.vADA.toLowerCase()]: iconSrcs.vAdaCore,
  [venusProtocolBscMainnetDeployments.addresses.vBCH.toLowerCase()]: iconSrcs.vBchCore,
  [venusProtocolBscMainnetDeployments.addresses.vBETH.toLowerCase()]: iconSrcs.vBethCore,
  [venusProtocolBscMainnetDeployments.addresses.vBNB.toLowerCase()]: iconSrcs.vBnbCore,
  [venusProtocolBscMainnetDeployments.addresses.vBTC.toLowerCase()]: iconSrcs.vBtcCore,
  [venusProtocolBscMainnetDeployments.addresses.vBUSD.toLowerCase()]: iconSrcs.vBusdCore,
  [venusProtocolBscMainnetDeployments.addresses.vCAKE.toLowerCase()]: iconSrcs.vCakeCore,
  [venusProtocolBscMainnetDeployments.addresses.vDAI.toLowerCase()]: iconSrcs.vDaiCore,
  [venusProtocolBscMainnetDeployments.addresses.vDOGE.toLowerCase()]: iconSrcs.vDogeCore,
  [venusProtocolBscMainnetDeployments.addresses.vDOT.toLowerCase()]: iconSrcs.vDotCore,
  [venusProtocolBscMainnetDeployments.addresses.vETH.toLowerCase()]: iconSrcs.vEthCore,
  [venusProtocolBscMainnetDeployments.addresses.vFDUSD.toLowerCase()]: iconSrcs.vFDUsdCore,
  [venusProtocolBscMainnetDeployments.addresses.vFIL.toLowerCase()]: iconSrcs.vFilCore,
  [venusProtocolBscMainnetDeployments.addresses.vLINK.toLowerCase()]: iconSrcs.vLinkCore,
  [venusProtocolBscMainnetDeployments.addresses.vLTC.toLowerCase()]: iconSrcs.vLtcCore,
  [venusProtocolBscMainnetDeployments.addresses.vLUNA.toLowerCase()]: iconSrcs.vLunaCore,
  [venusProtocolBscMainnetDeployments.addresses.vMATIC.toLowerCase()]: iconSrcs.vMaticCore,
  [venusProtocolBscMainnetDeployments.addresses.vSXP.toLowerCase()]: iconSrcs.vSxpCore,
  [venusProtocolBscMainnetDeployments.addresses.vTRX.toLowerCase()]: iconSrcs.vTrxCore,
  [venusProtocolBscMainnetDeployments.addresses.vTRXOLD.toLowerCase()]: iconSrcs.vTrxCore,
  [venusProtocolBscMainnetDeployments.addresses.vTUSD.toLowerCase()]: iconSrcs.vTusdCore,
  [venusProtocolBscMainnetDeployments.addresses.vTUSDOLD.toLowerCase()]: iconSrcs.vTusdCore,
  [venusProtocolBscMainnetDeployments.addresses.vUSDC.toLowerCase()]: iconSrcs.vUsdcCore,
  [venusProtocolBscMainnetDeployments.addresses.vUSDT.toLowerCase()]: iconSrcs.vUsdtCore,
  [venusProtocolBscMainnetDeployments.addresses.vUST.toLowerCase()]: iconSrcs.vUstCore,
  [venusProtocolBscMainnetDeployments.addresses.vWBETH.toLowerCase()]: iconSrcs.vWBethCore,
  [venusProtocolBscMainnetDeployments.addresses.vXRP.toLowerCase()]: iconSrcs.vXrpCore,
  [venusProtocolBscMainnetDeployments.addresses.vXVS.toLowerCase()]: iconSrcs.vXvsCore,
  // Defi pool
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vALPACA_DeFi.toLowerCase()]:
    iconSrcs.vAlpacaDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vANKR_DeFi.toLowerCase()]:
    iconSrcs.vAnkrDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vankrBNB_DeFi.toLowerCase()]:
    iconSrcs.vAnkrBnbDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBSW_DeFi.toLowerCase()]: iconSrcs.vBswDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vPLANET_DeFi.toLowerCase()]:
    iconSrcs.vPlanetDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vTWT_DeFi.toLowerCase()]: iconSrcs.vTwtDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_DeFi.toLowerCase()]:
    iconSrcs.vUsddDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_DeFi.toLowerCase()]:
    iconSrcs.vUsdtDefi,
  // Stablecoins
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_Stablecoins.toLowerCase()]:
    iconSrcs.vUsddStablecoins,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_Stablecoins.toLowerCase()]:
    iconSrcs.vUsdtStablecoins,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vEURA_Stablecoins.toLowerCase()]:
    iconSrcs.vEuraStablecoins,
  // Meme
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBabyDoge_Meme.toLowerCase()]:
    iconSrcs.vBabyDogeMeme,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_Meme.toLowerCase()]:
    iconSrcs.vUsdtMeme,
  // Gamefi
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vFLOKI_GameFi.toLowerCase()]:
    iconSrcs.vFlokiGamefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vRACA_GameFi.toLowerCase()]:
    iconSrcs.vRacaGamefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_GameFi.toLowerCase()]:
    iconSrcs.vUsddGamefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_GameFi.toLowerCase()]:
    iconSrcs.vUsdtGamefi,
  // Liquid Staked BNB
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vankrBNB_LiquidStakedBNB.toLowerCase()]:
    iconSrcs.vAnkrBnbLsBnb,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBNBx_LiquidStakedBNB.toLowerCase()]:
    iconSrcs.vBnbXLsBnb,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vslisBNB_LiquidStakedBNB.toLowerCase()]:
    iconSrcs.vSlisBnbLsBnb,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vstkBNB_LiquidStakedBNB.toLowerCase()]:
    iconSrcs.vStkBnbLsBnb,

  // Liquid Staked ETH
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vEthLsEth,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWeEthLsEth,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWstEthLsEth,

  // Tron
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBTT_Tron.toLowerCase()]: iconSrcs.vBttTron,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vTRX_Tron.toLowerCase()]: iconSrcs.vTrxTron,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_Tron.toLowerCase()]:
    iconSrcs.vUsddTron,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_Tron.toLowerCase()]:
    iconSrcs.vUsdtTron,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vWIN_Tron.toLowerCase()]: iconSrcs.vWinTron,
};
