import BigNumber from 'bignumber.js';

import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import { JumpRateModel, JumpRateModelV2 } from 'packages/contracts';
import { convertTokensToMantissa } from 'utilities';

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
  blocksPerDay,
}: GetVTokenInterestRatesInput): Promise<GetVTokenApySimulationsOutput> => {
  const reserveFactorMantissa = new BigNumber(asset.reserveFactor).multipliedBy(COMPOUND_MANTISSA);

  const getBorrowRatePromises: ReturnType<(typeof interestRateModelContract)['getBorrowRate']>[] =
    [];
  const getSupplyRatePromises: ReturnType<(typeof interestRateModelContract)['getSupplyRate']>[] =
    [];

  for (let u = 1; u <= 100; u++) {
    const utilizationRatePercentage = u / 100;
    const cashAmountMantissa = new BigNumber(1 / utilizationRatePercentage - 1)
      .times(REFERENCE_AMOUNT_MANTISSA)
      .dp(0)
      .toFixed();

    const borrowsAmountMantissa = new BigNumber(REFERENCE_AMOUNT_MANTISSA).toFixed();
    const reservesAmountMantissa = new BigNumber(0).toFixed();

    if (isIsolatedPoolMarket) {
      getBorrowRatePromises.push(
        (interestRateModelContract as JumpRateModelV2).getBorrowRate(
          cashAmountMantissa,
          borrowsAmountMantissa,
          reservesAmountMantissa,
          BAD_DEBT_MANTISSA,
        ),
      );

      getSupplyRatePromises.push(
        (interestRateModelContract as JumpRateModelV2).getSupplyRate(
          cashAmountMantissa,
          borrowsAmountMantissa,
          reservesAmountMantissa,
          reserveFactorMantissa.toFixed(),
          BAD_DEBT_MANTISSA,
        ),
      );
    } else {
      getBorrowRatePromises.push(
        (interestRateModelContract as JumpRateModel).getBorrowRate(
          cashAmountMantissa,
          borrowsAmountMantissa,
          reservesAmountMantissa,
        ),
      );

      getSupplyRatePromises.push(
        (interestRateModelContract as JumpRateModel).getSupplyRate(
          cashAmountMantissa,
          borrowsAmountMantissa,
          reservesAmountMantissa,
          reserveFactorMantissa.toFixed(),
        ),
      );
    }
  }

  const cashMantissa = convertTokensToMantissa({
    value: asset.cashTokens,
    token: asset.vToken.underlyingToken,
  }).toFixed();
  const borrowBalanceMantissa = convertTokensToMantissa({
    value: asset.borrowBalanceTokens,
    token: asset.vToken.underlyingToken,
  }).toFixed();
  const reservesMantissa = convertTokensToMantissa({
    value: asset.reserveTokens,
    token: asset.vToken.underlyingToken,
  }).toFixed();

  const groupedGetBorrowRatePromises = Promise.all(getBorrowRatePromises);
  const groupedGetSupplyRatePromises = Promise.all(getSupplyRatePromises);
  const utilizationRatePromise = isIsolatedPoolMarket
    ? (interestRateModelContract as JumpRateModelV2).utilizationRate(
        cashMantissa,
        borrowBalanceMantissa,
        reservesMantissa,
        BAD_DEBT_MANTISSA,
      )
    : (interestRateModelContract as JumpRateModel).utilizationRate(
        cashMantissa,
        borrowBalanceMantissa,
        reservesMantissa,
      );

  const borrowRates = await groupedGetBorrowRatePromises;
  const supplyRates = await groupedGetSupplyRatePromises;
  const utilizationRatePercentage = await utilizationRatePromise;

  const apySimulations = formatToApySnapshots({
    borrowRates,
    supplyRates,
    blocksPerDay,
  });
  const currentUtilizationRatePercentage = formatCurrentUtilizationRate({
    utilizationRatePercentage,
  });

  return { apySimulations, currentUtilizationRatePercentage };
};

export default getVTokenApySimulations;
