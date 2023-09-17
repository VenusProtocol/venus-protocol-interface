import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { convertTokensToWei } from 'utilities';

import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';

import formatCurrentUtilizationRate from './formatCurrentUtilizationRate';
import formatToApySnapshots from './formatToApySnapshots';
import { GetVTokenApySimulationsOutput, GetVTokenInterestRatesInput } from './types';

export * from './types';

const REFERENCE_AMOUNT_MANTISSA = 1e4;
const BAD_DEBT_MANTISSA = '0';

const getVTokenApySimulations = async ({
  interestRateModelContract,
  isIsolatedPoolMarket,
  asset,
}: GetVTokenInterestRatesInput): Promise<GetVTokenApySimulationsOutput> => {
  const reserveFactorMantissa = new BigNumber(asset.reserveFactor).multipliedBy(COMPOUND_MANTISSA);

  const getBorrowRatePromises: ReturnType<(typeof interestRateModelContract)['getBorrowRate']>[] =
    [];
  const getSupplyRatePromises: ReturnType<(typeof interestRateModelContract)['getSupplyRate']>[] =
    [];

  for (let u = 1; u <= 100; u++) {
    const utilizationRate = u / 100;
    const cashAmountWei = new BigNumber(1 / utilizationRate - 1)
      .times(REFERENCE_AMOUNT_MANTISSA)
      .dp(0)
      .toFixed();

    const borrowsAmountWei = new BigNumber(REFERENCE_AMOUNT_MANTISSA).toFixed();
    const reservesAmountWei = new BigNumber(0).toFixed();

    if (isIsolatedPoolMarket) {
      getBorrowRatePromises.push(
        (interestRateModelContract as ContractTypeByName<'jumpRateModelV2'>).getBorrowRate(
          cashAmountWei,
          borrowsAmountWei,
          reservesAmountWei,
          BAD_DEBT_MANTISSA,
        ),
      );

      getSupplyRatePromises.push(
        (interestRateModelContract as ContractTypeByName<'jumpRateModelV2'>).getSupplyRate(
          cashAmountWei,
          borrowsAmountWei,
          reservesAmountWei,
          reserveFactorMantissa.toFixed(),
          BAD_DEBT_MANTISSA,
        ),
      );
    } else {
      getBorrowRatePromises.push(
        (interestRateModelContract as ContractTypeByName<'jumpRateModel'>).getBorrowRate(
          cashAmountWei,
          borrowsAmountWei,
          reservesAmountWei,
        ),
      );

      getSupplyRatePromises.push(
        (interestRateModelContract as ContractTypeByName<'jumpRateModel'>).getSupplyRate(
          cashAmountWei,
          borrowsAmountWei,
          reservesAmountWei,
          reserveFactorMantissa.toFixed(),
        ),
      );
    }
  }

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

  const groupedGetBorrowRatePromises = Promise.all(getBorrowRatePromises);
  const groupedGetSupplyRatePromises = Promise.all(getSupplyRatePromises);
  const utilizationRatePromise = isIsolatedPoolMarket
    ? (interestRateModelContract as ContractTypeByName<'jumpRateModelV2'>).utilizationRate(
        cashWei,
        borrowBalanceWei,
        reservesWei,
        BAD_DEBT_MANTISSA,
      )
    : (interestRateModelContract as ContractTypeByName<'jumpRateModel'>).utilizationRate(
        cashWei,
        borrowBalanceWei,
        reservesWei,
      );

  const borrowRates = await groupedGetBorrowRatePromises;
  const supplyRates = await groupedGetSupplyRatePromises;
  const utilizationRate = await utilizationRatePromise;

  const apySimulations = formatToApySnapshots({
    borrowRates,
    supplyRates,
  });
  const currentUtilizationRate = formatCurrentUtilizationRate({
    utilizationRate,
  });

  return { apySimulations, currentUtilizationRate };
};

export default getVTokenApySimulations;
