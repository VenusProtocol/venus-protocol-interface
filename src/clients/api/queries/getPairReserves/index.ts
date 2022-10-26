import { Pair as PSPair } from '@pancakeswap/sdk/dist/index.js';
import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';

import pancakeSwapPairAbi from 'constants/contracts/abis/pancakeSwapPair.json';

import formatToPairReserves from './formatToPairReserves';
import { GetPairReservesInput, GetPairReservesOutput, PairAddress } from './types';

export * from './types';

const getPairReserves = async ({
  multicall,
  tokenCombinations,
}: GetPairReservesInput): Promise<GetPairReservesOutput> => {
  // Generate pair addresses from token combinations
  const pairAddresses: PairAddress[] = tokenCombinations.reduce((acc, [tokenA, tokenB]) => {
    try {
      if (tokenA && tokenB && !tokenA.equals(tokenB)) {
        const address = PSPair.getAddress(tokenA, tokenB);

        const pairAddress: PairAddress = {
          tokenCombination: [tokenA, tokenB],
          address,
        };

        return [...acc, pairAddress];
      }

      return acc;
    } catch {
      // PSPair.getAddress can error out, in which case we exclude the pair from
      // the list
      return acc;
    }
  }, [] as PairAddress[]);

  // Generate call context
  const contractCallContext: ContractCallContext[] = pairAddresses.map(pairAddress => ({
    reference: pairAddress.address,
    contractAddress: pairAddress.address,
    abi: pancakeSwapPairAbi,
    calls: [{ reference: 'getReserves', methodName: 'getReserves()', methodParameters: [] }],
  }));

  // TODO: check why queries seem to get cached
  const reserveCallResults: ContractCallResults = await multicall.call(contractCallContext);

  const formattedResult = formatToPairReserves({
    pairAddresses,
    reserveCallResults,
  });

  return formattedResult;
};

export default getPairReserves;
