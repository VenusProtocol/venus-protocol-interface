import BigNumber from 'bignumber.js';
import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';

import interestModelAbi from 'constants/contracts/abis/interestModel.json';

// TODO: delete these utils (no longer used)
// import getVTokenBorrowRate from '../getVTokenBorrowRate';
// import getVTokenSupplyRate from '../getVTokenSupplyRate';
import formatToApySnapshots from './formatToApySnapshots';
import { GetVTokenApySimulationsOutput, GetVTokenInterestRatesInput } from './types';

export * from './types';

const REFERENCE_AMOUNT_WEI = 1e4;

const getVTokenApySimulations = async ({
  multicall,
  reserveFactorMantissa,
  interestRateModelDataContractAddress,
}: GetVTokenInterestRatesInput): Promise<GetVTokenApySimulationsOutput> => {
  const calls: ContractCallContext<any>['calls'] = [];

  for (let u = 1; u <= 100; u++) {
    const utilizationRate = u / 100;
    const cashAmountWei = new BigNumber(1 / utilizationRate - 1)
      .times(REFERENCE_AMOUNT_WEI)
      .dp(0)
      .toFixed();

    const borrowsAmountWei = new BigNumber(REFERENCE_AMOUNT_WEI).toFixed();
    const reservesAmountWei = new BigNumber(0).toFixed();

    calls.push({
      reference: 'getBorrowRate',
      methodName: 'getBorrowRate',
      methodParameters: [cashAmountWei, borrowsAmountWei, reservesAmountWei],
    });

    calls.push({
      reference: 'getSupplyRate',
      methodName: 'getSupplyRate',
      methodParameters: [
        cashAmountWei,
        borrowsAmountWei,
        reservesAmountWei,
        reserveFactorMantissa.toFixed(),
      ],
    });
  }

  const contractCallContext: ContractCallContext = {
    reference: 'getVTokenRates',
    contractAddress: interestRateModelDataContractAddress,
    abi: interestModelAbi,
    calls,
  };

  const vTokenBalanceCallResults: ContractCallResults = await multicall.call(contractCallContext);
  const apySimulations = formatToApySnapshots({ vTokenBalanceCallResults });

  return { apySimulations };
};

export default getVTokenApySimulations;
