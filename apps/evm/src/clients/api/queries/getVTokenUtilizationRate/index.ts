import type { JumpRateModel, JumpRateModelV2 } from 'libs/contracts';
import { convertTokensToMantissa } from 'utilities';

import BigNumber from 'bignumber.js';
import type { Asset } from 'types';

const BAD_DEBT_MANTISSA = '0';
const DIVIDER = 10 ** 16;

export interface GetVTokenUtilizationRateInput {
  interestRateModelContract: JumpRateModel | JumpRateModelV2;
  isIsolatedPoolMarket: boolean;
  asset: Asset;
}

export type GetVTokenUtilizationRateOutput = {
  currentUtilizationRatePercentage: number;
};

const getVTokenUtilizationRate = async ({
  interestRateModelContract,
  isIsolatedPoolMarket,
  asset,
}: GetVTokenUtilizationRateInput): Promise<GetVTokenUtilizationRateOutput> => {
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

  const utilizationRatePercentage = await utilizationRatePromise;

  const currentUtilizationRatePercentage = new BigNumber(utilizationRatePercentage.toString())
    .dividedToIntegerBy(DIVIDER)
    .toNumber();

  return { currentUtilizationRatePercentage };
};

export default getVTokenUtilizationRate;
