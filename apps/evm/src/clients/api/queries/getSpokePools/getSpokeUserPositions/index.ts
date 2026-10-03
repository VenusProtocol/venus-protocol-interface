import BigNumber from 'bignumber.js';

import { isolatedPoolComptrollerAbi, poolLensAbi } from 'libs/contracts';
import { areAddressesEqual } from 'utilities';
import type { Address, PublicClient } from 'viem';

import type { ApiSpokePool, SpokeUserPosition } from '../types';

export interface GetSpokeUserPositionsInput {
  publicClient: PublicClient;
  poolLensContractAddress: Address;
  apiPools: ApiSpokePool[];
  accountAddress: Address;
}

export const getSpokeUserPositions = async ({
  publicClient,
  poolLensContractAddress,
  apiPools,
  accountAddress,
}: GetSpokeUserPositionsInput): Promise<SpokeUserPosition[]> => {
  const vTokenAddresses = apiPools.flatMap(apiPool =>
    apiPool.markets.filter(({ isListed }) => isListed).map(({ address }) => address),
  );

  const [{ result: vTokenBalances }, enteredVTokenAddressesByPool] = await Promise.all([
    publicClient.simulateContract({
      abi: poolLensAbi,
      address: poolLensContractAddress,
      functionName: 'vTokenBalancesAll',
      args: [vTokenAddresses, accountAddress],
    }),
    Promise.all(
      apiPools.map(apiPool =>
        publicClient.readContract({
          abi: isolatedPoolComptrollerAbi,
          address: apiPool.address,
          functionName: 'getAssetsIn',
          args: [accountAddress],
        }),
      ),
    ),
  ]);

  const enteredVTokenAddresses = enteredVTokenAddressesByPool.flat();

  return vTokenBalances.map(vTokenBalance => ({
    vTokenAddress: vTokenBalance.vToken,
    supplyBalanceMantissa: new BigNumber(vTokenBalance.balanceOfUnderlying.toString()),
    borrowBalanceMantissa: new BigNumber(vTokenBalance.borrowBalanceCurrent.toString()),
    isCollateral: enteredVTokenAddresses.some(address =>
      areAddressesEqual(address, vTokenBalance.vToken),
    ),
  }));
};
