import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import { xVSProxyOFTSrcAbi } from 'libs/contracts';
import type { ChainId } from 'types';

export interface GetXvsBridgeDestinationLimitsInput {
  toChainIds: ChainId[];
  bridgeContractAddress: Address;
  publicClient: PublicClient;
}

export interface GetXvsBridgeDestinationLimitsOutput {
  maxSingleTransactionLimitMantissas: Partial<Record<ChainId, BigNumber>>;
}

// We should normally pass either the SRC or the DEST contract ABI based on the direction of the
// transfer, but since both use the same definitions for the functions used in this query it does
// not matter
const abi = xVSProxyOFTSrcAbi;

// Reads the single transaction limit the source chain's OFT applies to each candidate destination
// lane. A limit of 0 means the lane is closed and every send through it reverts on the contract
// guard, so the destination must not be offered.
export const getXvsBridgeDestinationLimits = async ({
  toChainIds,
  bridgeContractAddress,
  publicClient,
}: GetXvsBridgeDestinationLimitsInput): Promise<GetXvsBridgeDestinationLimitsOutput> => {
  const maxSingleTransactionLimits = await Promise.all(
    toChainIds.map(toChainId =>
      publicClient.readContract({
        address: bridgeContractAddress,
        abi,
        functionName: 'chainIdToMaxSingleTransactionLimit',
        args: [LAYER_ZERO_CHAIN_IDS[toChainId]],
      }),
    ),
  );

  const maxSingleTransactionLimitMantissas = toChainIds.reduce<Partial<Record<ChainId, BigNumber>>>(
    (acc, toChainId, index) => ({
      ...acc,
      [toChainId]: new BigNumber(maxSingleTransactionLimits[index].toString()),
    }),
    {},
  );

  return { maxSingleTransactionLimitMantissas };
};
