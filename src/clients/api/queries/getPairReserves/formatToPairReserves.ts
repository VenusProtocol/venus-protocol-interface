import BigNumber from 'bignumber.js';
import { ContractCallResults } from 'ethereum-multicall';

import { GetPairReservesOutput, PairAddress, PairReserves } from './types';

const formatToPairReserves = ({
  pairAddresses,
  reserveCallResults,
}: {
  pairAddresses: PairAddress[];
  reserveCallResults: ContractCallResults;
}): GetPairReservesOutput => {
  const pairReserves = pairAddresses.reduce((acc, pairAddress) => {
    const reserveCallResult =
      reserveCallResults.results[pairAddress.address].callsReturnContext[0].returnValues;

    // Exclude pair if results don't include it
    if (!reserveCallResult?.length) {
      return acc;
    }

    const singlePairReserves: PairReserves = {
      address: pairAddress.address,
      tokenReserves: [
        {
          token: pairAddress.tokenCombination[0],
          reserveWei: new BigNumber(reserveCallResult[0].hex),
        },
        {
          token: pairAddress.tokenCombination[1],
          reserveWei: new BigNumber(reserveCallResult[1].hex),
        },
      ],
    };

    return [...acc, singlePairReserves];
  }, [] as PairReserves[]);

  return { pairReserves };
};

export default formatToPairReserves;
