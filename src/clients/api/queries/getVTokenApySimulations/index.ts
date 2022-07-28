import BigNumber from 'bignumber.js';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { InterestModel } from 'types/contracts';

import getVTokenBorrowRate from '../getVTokenBorrowRate';
import getVTokenSupplyRate from '../getVTokenSupplyRate';

const REFERENCE_AMOUNT_WEI = 1e4;

export interface GetVTokenInterestRatesInput {
  interestModelContract: InterestModel;
  reserveFactorMantissa: BigNumber;
}

export interface VTokenApySnapshot {
  utilizationRate: number;
  borrowApyPercentage: number;
  supplyApyPercentage: number;
}

export type GetVTokenApySimulationsOutput = {
  apySimulations: VTokenApySnapshot[];
};

const getVTokenApySimulations = async ({
  interestModelContract,
  reserveFactorMantissa,
}: GetVTokenInterestRatesInput): Promise<GetVTokenApySimulationsOutput> => {
  const promises: Promise<VTokenApySnapshot>[] = [];

  for (let u = 1; u <= 100; u++) {
    const utilizationRate = u / 100;

    const getRates = async () => {
      const borrowRateData = await getVTokenBorrowRate({
        interestModelContract,
        cashAmountWei: new BigNumber(1 / utilizationRate - 1).times(REFERENCE_AMOUNT_WEI).dp(0),
        borrowsAmountWei: new BigNumber(REFERENCE_AMOUNT_WEI),
        reservesAmountWei: new BigNumber(0),
      });

      const borrowBase = borrowRateData.borrowRate
        .div(COMPOUND_MANTISSA)
        .times(BLOCKS_PER_DAY)
        .plus(1);

      const borrowApyPercentage = borrowBase
        .pow(DAYS_PER_YEAR - 1)
        .minus(1)
        .times(100)
        .toNumber();

      const { supplyRateWei } = await getVTokenSupplyRate({
        interestModelContract,
        cashAmountWei: new BigNumber(1 / utilizationRate - 1).times(REFERENCE_AMOUNT_WEI).dp(0),
        borrowsAmountWei: new BigNumber(REFERENCE_AMOUNT_WEI),
        reservesAmountWei: new BigNumber(0),
        reserveFactorMantissa,
      });

      const supplyBase = supplyRateWei.div(COMPOUND_MANTISSA).times(BLOCKS_PER_DAY).plus(1);

      const supplyApyPercentage = supplyBase
        .pow(DAYS_PER_YEAR - 1)
        .minus(1)
        .times(100)
        .toNumber();

      return {
        utilizationRate: utilizationRate * 100,
        borrowApyPercentage,
        supplyApyPercentage,
      };
    };

    promises.push(getRates());
  }

  const apySimulations = await Promise.all(promises);
  return { apySimulations };
};

export default getVTokenApySimulations;
