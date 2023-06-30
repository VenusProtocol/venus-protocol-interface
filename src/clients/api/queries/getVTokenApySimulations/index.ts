import BigNumber from 'bignumber.js';
import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';

import interestModelAbi from 'constants/contracts/abis/interestModel.json';
import interestModelAbiV2 from 'constants/contracts/abis/interestModelV2.json';

import formatToApySnapshots from './formatToApySnapshots';
import { GetVTokenApySimulationsOutput, GetVTokenInterestRatesInput } from './types';

export * from './types';

const REFERENCE_AMOUNT_WEI = 1e4;

const getVTokenApySimulations = async ({
  multicall,
  reserveFactorMantissa,
  interestRateModelContractAddress,
  isIsolatedPoolMarket,
}: GetVTokenInterestRatesInput): Promise<GetVTokenApySimulationsOutput> => {
  const calls: ContractCallContext['calls'] = [];

  for (let u = 1; u <= 100; u++) {
    const utilizationRate = u / 100;
    const cashAmountWei = new BigNumber(1 / utilizationRate - 1)
      .times(REFERENCE_AMOUNT_WEI)
      .dp(0)
      .toFixed();

    const borrowsAmountWei = new BigNumber(REFERENCE_AMOUNT_WEI).toFixed();
    const reservesAmountWei = new BigNumber(0).toFixed();
    const badDebtWei = new BigNumber(0).toFixed();

    const getBorrowRateParams = [cashAmountWei, borrowsAmountWei, reservesAmountWei];

    if (isIsolatedPoolMarket) getBorrowRateParams.push(badDebtWei);

    calls.push({
      reference: 'getBorrowRate',
      methodName: 'getBorrowRate',
      methodParameters: getBorrowRateParams,
    });

    const getSupplyRateParams = [
      cashAmountWei,
      borrowsAmountWei,
      reservesAmountWei,
      reserveFactorMantissa.toFixed(),
    ];

    if (isIsolatedPoolMarket) getSupplyRateParams.push(badDebtWei);

    calls.push({
      reference: 'getSupplyRate',
      methodName: 'getSupplyRate',
      methodParameters: getSupplyRateParams,
    });
  }

  const contractCallContext: ContractCallContext = {
    reference: 'getVTokenRates',
    contractAddress: interestRateModelContractAddress,
    abi: isIsolatedPoolMarket ? interestModelAbiV2 : interestModelAbi,
    calls,
  };

  const vTokenBalanceCallResults: ContractCallResults = await multicall.call(contractCallContext);
  const apySimulations = formatToApySnapshots({ vTokenBalanceCallResults });

  return { apySimulations };
};

export default getVTokenApySimulations;
