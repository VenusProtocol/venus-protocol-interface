import type { Abi } from 'viem';

import {
  isolatedPoolComptrollerAbi,
  legacyPoolComptrollerAbi,
  leverageManagerAbi,
  nativeTokenGatewayAbi,
  nexusAbi,
  nexusAccountFactoryAbi,
  nexusBoostrapAbi,
  omnichainGovernanceExecutorAbi,
  pendlePtVaultAbi,
  primeAbi,
  relativePositionManagerAbi,
  resilientOracleAbi,
  rewardsDistributorAbi,
  swapRouterAbi,
  vBep20Abi,
  vBnbAbi,
  vaiControllerAbi,
  xVSProxyOFTDestAbi,
  xVSProxyOFTSrcAbi,
  xvsTokenOmnichainAbi,
} from 'libs/contracts';

// ABIs scanned to decode raw revert data when viem has not pre-decoded it.
// Includes all Venus contracts the frontend interacts with, plus third-party
// contracts users can reach (smart accounts, swap, bridge).
export const CONTRACT_ERROR_ABIS: Abi[] = [
  // Venus — core lending
  isolatedPoolComptrollerAbi,
  legacyPoolComptrollerAbi,
  vBep20Abi,
  vBnbAbi,
  vaiControllerAbi,
  // Venus — extras
  primeAbi,
  nativeTokenGatewayAbi,
  rewardsDistributorAbi,
  swapRouterAbi,
  leverageManagerAbi,
  relativePositionManagerAbi,
  pendlePtVaultAbi,
  resilientOracleAbi,
  // Venus — cross-chain / governance
  xvsTokenOmnichainAbi,
  xVSProxyOFTDestAbi,
  xVSProxyOFTSrcAbi,
  omnichainGovernanceExecutorAbi,
  // Third-party — smart accounts
  nexusAbi,
  nexusAccountFactoryAbi,
  nexusBoostrapAbi,
];
