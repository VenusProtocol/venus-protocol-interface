import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import type { LiquidityHub } from 'types';
import { areAddressesEqual } from 'utilities';
import type { Address } from 'viem';

export interface GetLiquidityHubInput {
  vhTokenAddress: Address;
}

export interface GetLiquidityHubOutput {
  liquidityHub?: LiquidityHub;
}

export const getLiquidityHub = async ({
  vhTokenAddress,
}: GetLiquidityHubInput): Promise<GetLiquidityHubOutput> => {
  const liquidityHub = liquidityHubs.find(currLiquidityHub =>
    areAddressesEqual(currLiquidityHub.vhToken.address, vhTokenAddress),
  );

  return {
    liquidityHub,
  };
};
