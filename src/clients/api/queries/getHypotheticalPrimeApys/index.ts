import BigNumber from 'bignumber.js';
import { Prime } from 'packages/contracts';
import { calculateApy } from 'utilities';

import { DAYS_PER_YEAR } from 'constants/daysPerYear';

export interface GetHypotheticalPrimeApysInput {
  primeContract: Prime;
  accountAddress: string;
  vTokenAddress: string;
  userBorrowBalanceMantissa: BigNumber;
  userSupplyBalanceMantissa: BigNumber;
  userXvsStakedMantissa: BigNumber;
}

export interface GetHypotheticalPrimeApysOutput {
  supplyApyPercentage: BigNumber;
  borrowApyPercentage: BigNumber;
}

const convertAprToApy = ({ aprBips }: { aprBips: string }) => {
  // Convert bips to daily rate
  const dailyRate = new BigNumber(aprBips).div(1000).div(DAYS_PER_YEAR);
  // Convert daily rate to APY
  return calculateApy({ dailyRate });
};

const getHypotheticalPrimeApys = async ({
  primeContract,
  vTokenAddress,
  accountAddress,
  userBorrowBalanceMantissa,
  userSupplyBalanceMantissa,
  userXvsStakedMantissa,
}: GetHypotheticalPrimeApysInput): Promise<GetHypotheticalPrimeApysOutput> => {
  const { borrowAPR, supplyAPR } = await primeContract.estimateAPR(
    vTokenAddress,
    accountAddress,
    userBorrowBalanceMantissa.toFixed(),
    userSupplyBalanceMantissa.toFixed(),
    userXvsStakedMantissa.toFixed(),
  );

  // Convert APRs to APYs
  const supplyApyPercentage = convertAprToApy({ aprBips: supplyAPR.toString() });
  const borrowApyPercentage = convertAprToApy({ aprBips: borrowAPR.toString() });

  return {
    supplyApyPercentage,
    borrowApyPercentage,
  };
};

export default getHypotheticalPrimeApys;
