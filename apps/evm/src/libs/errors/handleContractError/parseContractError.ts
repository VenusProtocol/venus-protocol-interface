import {
  type Abi,
  BaseError,
  ContractFunctionRevertedError,
  type Hex,
  decodeErrorResult,
} from 'viem';

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

export interface ParsedContractError {
  errorName: string;
  args?: readonly unknown[];
  signature?: Hex;
}

// ABIs scanned to decode raw revert data when viem has not pre-decoded it.
// Includes all Venus contracts the frontend interacts with, plus third-party
// contracts users can reach (smart accounts, swap, bridge).
const KNOWN_ABIS: Abi[] = [
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

const SELECTOR_LENGTH = 10;

export const parseContractError = (error: unknown): ParsedContractError | undefined => {
  if (!(error instanceof BaseError)) {
    return undefined;
  }

  // viem already decoded the revert via the ABI used at call time (writeContract / simulateContract path)
  const preDecoded = readPreDecodedRevert(error);
  if (preDecoded) {
    return preDecoded;
  }

  const rawData = readRawRevertData(error);
  if (!rawData) {
    return undefined;
  }
  const signature = rawData.slice(0, SELECTOR_LENGTH) as Hex;
  return (
    decodeWithKnownAbis(rawData, signature) ?? { errorName: 'UnknownContractError', signature }
  );
};

const readPreDecodedRevert = (error: BaseError): ParsedContractError | undefined => {
  const layer = error.walk(e => e instanceof ContractFunctionRevertedError);
  if (!(layer instanceof ContractFunctionRevertedError) || !layer.data?.errorName) {
    return undefined;
  }
  return {
    errorName: layer.data.errorName,
    args: layer.data.args,
    signature: layer.signature,
  };
};

const readRawRevertData = (error: BaseError): Hex | undefined => {
  const layer = error.walk(e => isHexSelector(getDataField(e)));
  const data = getDataField(layer);
  return isHexSelector(data) ? data : undefined;
};

const decodeWithKnownAbis = (rawData: Hex, signature: Hex): ParsedContractError | undefined => {
  for (const abi of KNOWN_ABIS) {
    try {
      const decoded = decodeErrorResult({ abi, data: rawData });
      return { errorName: decoded.errorName, args: decoded.args, signature };
    } catch {
      // selector not in this ABI
    }
  }
  return undefined;
};

const getDataField = (value: unknown): unknown => (value as { data?: unknown } | null)?.data;

const isHexSelector = (value: unknown): value is Hex =>
  typeof value === 'string' && value.startsWith('0x') && value.length >= SELECTOR_LENGTH;
