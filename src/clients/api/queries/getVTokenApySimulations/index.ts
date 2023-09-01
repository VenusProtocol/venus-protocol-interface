import BigNumber from 'bignumber.js';
import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import { contractInfos } from 'packages/contracts';
import { convertTokensToWei } from 'utilities';

import formatCurrentUtilizationRate from './formatCurrentUtilizationRate';
import formatToApySnapshots from './formatToApySnapshots';
import { GetVTokenApySimulationsOutput, GetVTokenInterestRatesInput } from './types';

export * from './types';

const REFERENCE_AMOUNT_WEI = 1e4;

const getVTokenApySimulations = async ({
  multicall3,
  reserveFactorMantissa,
  interestRateModelContractAddress,
  isIsolatedPoolMarket,
  asset,
}: GetVTokenInterestRatesInput): Promise<GetVTokenApySimulationsOutput> => {
  const calls: ContractCallContext['calls'] = [];
  const badDebtWei = new BigNumber(0).toFixed();

  for (let u = 1; u <= 100; u++) {
    const utilizationRate = u / 100;
    const cashAmountWei = new BigNumber(1 / utilizationRate - 1)
      .times(REFERENCE_AMOUNT_WEI)
      .dp(0)
      .toFixed();

    const borrowsAmountWei = new BigNumber(REFERENCE_AMOUNT_WEI).toFixed();
    const reservesAmountWei = new BigNumber(0).toFixed();

    const getBorrowRateParams = [cashAmountWei, borrowsAmountWei, reservesAmountWei];

    calls.push({
      reference: 'getBorrowRate',
      methodName: 'getBorrowRate',
      methodParameters: isIsolatedPoolMarket
        ? [...getBorrowRateParams, badDebtWei]
        : getBorrowRateParams,
    });

    const getSupplyRateParams = [
      cashAmountWei,
      borrowsAmountWei,
      reservesAmountWei,
      reserveFactorMantissa.toFixed(),
    ];

    calls.push({
      reference: 'getSupplyRate',
      methodName: 'getSupplyRate',
      methodParameters: isIsolatedPoolMarket
        ? [...getSupplyRateParams, badDebtWei]
        : getSupplyRateParams,
    });
  }

  if (asset) {
    const cashWei = convertTokensToWei({
      value: asset.cashTokens,
      token: asset.vToken.underlyingToken,
    }).toFixed();
    const borrowBalanceWei = convertTokensToWei({
      value: asset.borrowBalanceTokens,
      token: asset.vToken.underlyingToken,
    }).toFixed();
    const reservesWei = convertTokensToWei({
      value: asset.reserveTokens,
      token: asset.vToken.underlyingToken,
    }).toFixed();

    const utilizationRateParams = [cashWei, borrowBalanceWei, reservesWei];

    calls.push({
      reference: 'utilizationRate',
      methodName: 'utilizationRate',
      methodParameters: isIsolatedPoolMarket
        ? [...utilizationRateParams, badDebtWei]
        : utilizationRateParams,
    });
  }

  const contractCallContext: ContractCallContext = {
    reference: 'getVTokenRates',
    contractAddress: interestRateModelContractAddress,
    abi: isIsolatedPoolMarket ? contractInfos.jumpRateModelV2.abi : contractInfos.jumpRateModel.abi,
    calls,
  };

  const vTokenBalanceCallResults: ContractCallResults = await multicall3.call(contractCallContext);

  const apySimulations = formatToApySnapshots({ vTokenBalanceCallResults });
  const currentUtilizationRate = asset
    ? formatCurrentUtilizationRate({ vTokenBalanceCallResults })
    : 0;

  return { apySimulations, currentUtilizationRate };
};

export default getVTokenApySimulations;
