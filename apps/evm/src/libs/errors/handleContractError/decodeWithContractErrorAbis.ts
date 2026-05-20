import { type Abi, type Hex, decodeErrorResult } from 'viem';

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

import type { ParsedContractError } from './parseContractError';

// ABIs scanned to decode raw revert data when viem has not pre-decoded it.
// Includes all Venus contracts the frontend interacts with, plus third-party
// contracts users can reach (smart accounts, swap, bridge).
const CONTRACT_ERROR_ABIS: Abi[] = [
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

export const decodeWithContractErrorAbis = (
  rawData: Hex,
  signature: Hex,
): ParsedContractError | undefined => {
  for (const abi of CONTRACT_ERROR_ABIS) {
    try {
      const decoded = decodeErrorResult({ abi, data: rawData });
      return { errorName: decoded.errorName, args: decoded.args, signature };
    } catch {
      // selector not in this ABI
    }
  }
  return undefined;
};
