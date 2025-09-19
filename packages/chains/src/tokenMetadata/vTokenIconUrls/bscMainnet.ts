import isolatedPoolsBscMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet_addresses.json';
import venusProtocolBscMainnetDeployments from '@venusprotocol/venus-protocol/deployments/bscmainnet_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [venusProtocolBscMainnetDeployments.addresses.vAAVE.toLowerCase()]: tokenIconUrls.vAaveCore,
  [venusProtocolBscMainnetDeployments.addresses.vADA.toLowerCase()]: tokenIconUrls.vAdaCore,
  [venusProtocolBscMainnetDeployments.addresses.vBCH.toLowerCase()]: tokenIconUrls.vBchCore,
  [venusProtocolBscMainnetDeployments.addresses.vBETH.toLowerCase()]: tokenIconUrls.vBethCore,
  [venusProtocolBscMainnetDeployments.addresses.vBNB.toLowerCase()]: tokenIconUrls.vBnbCore,
  [venusProtocolBscMainnetDeployments.addresses.vBTC.toLowerCase()]: tokenIconUrls.vBtcCore,
  [venusProtocolBscMainnetDeployments.addresses.vBUSD.toLowerCase()]: tokenIconUrls.vBusdCore,
  [venusProtocolBscMainnetDeployments.addresses.vCAKE.toLowerCase()]: tokenIconUrls.vCakeCore,
  [venusProtocolBscMainnetDeployments.addresses.vDAI.toLowerCase()]: tokenIconUrls.vDaiCore,
  [venusProtocolBscMainnetDeployments.addresses.vDOGE.toLowerCase()]: tokenIconUrls.vDogeCore,
  [venusProtocolBscMainnetDeployments.addresses.vDOT.toLowerCase()]: tokenIconUrls.vDotCore,
  [venusProtocolBscMainnetDeployments.addresses.vETH.toLowerCase()]: tokenIconUrls.vEthCore,
  [venusProtocolBscMainnetDeployments.addresses.vFDUSD.toLowerCase()]: tokenIconUrls.vFDUsdCore,
  [venusProtocolBscMainnetDeployments.addresses.vFIL.toLowerCase()]: tokenIconUrls.vFilCore,
  [venusProtocolBscMainnetDeployments.addresses.vLINK.toLowerCase()]: tokenIconUrls.vLinkCore,
  [venusProtocolBscMainnetDeployments.addresses.vLTC.toLowerCase()]: tokenIconUrls.vLtcCore,
  [venusProtocolBscMainnetDeployments.addresses.vLUNA.toLowerCase()]: tokenIconUrls.vLunaCore,
  [venusProtocolBscMainnetDeployments.addresses.vMATIC.toLowerCase()]: tokenIconUrls.vMaticCore,
  [venusProtocolBscMainnetDeployments.addresses.vSXP.toLowerCase()]: tokenIconUrls.vSxpCore,
  [venusProtocolBscMainnetDeployments.addresses.vTRX.toLowerCase()]: tokenIconUrls.vTrxCore,
  [venusProtocolBscMainnetDeployments.addresses.vTRXOLD.toLowerCase()]: tokenIconUrls.vTrxCore,
  [venusProtocolBscMainnetDeployments.addresses.vTUSD.toLowerCase()]: tokenIconUrls.vTusdCore,
  [venusProtocolBscMainnetDeployments.addresses.vTUSDOLD.toLowerCase()]: tokenIconUrls.vTusdCore,
  [venusProtocolBscMainnetDeployments.addresses.vUSDC.toLowerCase()]: tokenIconUrls.vUsdcCore,
  [venusProtocolBscMainnetDeployments.addresses.vUSDT.toLowerCase()]: tokenIconUrls.vUsdtCore,
  [venusProtocolBscMainnetDeployments.addresses.vUST.toLowerCase()]: tokenIconUrls.vUstCore,
  [venusProtocolBscMainnetDeployments.addresses.vWBETH.toLowerCase()]: tokenIconUrls.vWBethCore,
  [venusProtocolBscMainnetDeployments.addresses.vXRP.toLowerCase()]: tokenIconUrls.vXrpCore,
  [venusProtocolBscMainnetDeployments.addresses.vXVS.toLowerCase()]: tokenIconUrls.vXvsCore,
  // Defi pool
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vALPACA_DeFi.toLowerCase()]:
    tokenIconUrls.vAlpacaDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vANKR_DeFi.toLowerCase()]:
    tokenIconUrls.vAnkrDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vankrBNB_DeFi.toLowerCase()]:
    tokenIconUrls.vAnkrBnbDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBSW_DeFi.toLowerCase()]:
    tokenIconUrls.vBswDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vPLANET_DeFi.toLowerCase()]:
    tokenIconUrls.vPlanetDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vTWT_DeFi.toLowerCase()]:
    tokenIconUrls.vTwtDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_DeFi.toLowerCase()]:
    tokenIconUrls.vUsddDefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_DeFi.toLowerCase()]:
    tokenIconUrls.vUsdtDefi,
  // Stablecoins
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_Stablecoins.toLowerCase()]:
    tokenIconUrls.vUsddStablecoins,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_Stablecoins.toLowerCase()]:
    tokenIconUrls.vUsdtStablecoins,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vEURA_Stablecoins.toLowerCase()]:
    tokenIconUrls.vEuraStablecoins,
  // Meme
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBabyDoge_Meme.toLowerCase()]:
    tokenIconUrls.vBabyDogeMeme,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_Meme.toLowerCase()]:
    tokenIconUrls.vUsdtMeme,
  // Gamefi
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vFLOKI_GameFi.toLowerCase()]:
    tokenIconUrls.vFlokiGamefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vRACA_GameFi.toLowerCase()]:
    tokenIconUrls.vRacaGamefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_GameFi.toLowerCase()]:
    tokenIconUrls.vUsddGamefi,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_GameFi.toLowerCase()]:
    tokenIconUrls.vUsdtGamefi,
  // Liquid Staked BNB
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vankrBNB_LiquidStakedBNB.toLowerCase()]:
    tokenIconUrls.vAnkrBnbLsBnb,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBNBx_LiquidStakedBNB.toLowerCase()]:
    tokenIconUrls.vBnbXLsBnb,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vslisBNB_LiquidStakedBNB.toLowerCase()]:
    tokenIconUrls.vSlisBnbLsBnb,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vstkBNB_LiquidStakedBNB.toLowerCase()]:
    tokenIconUrls.vStkBnbLsBnb,

  // Liquid Staked ETH
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vEthLsEth,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWeEthLsEth,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWstEthLsEth,

  // Tron
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBTT_Tron.toLowerCase()]:
    tokenIconUrls.vBttTron,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vTRX_Tron.toLowerCase()]:
    tokenIconUrls.vTrxTron,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_Tron.toLowerCase()]:
    tokenIconUrls.vUsddTron,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_Tron.toLowerCase()]:
    tokenIconUrls.vUsdtTron,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vWIN_Tron.toLowerCase()]:
    tokenIconUrls.vWinTron,
};
