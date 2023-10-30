import BigNumber from 'bignumber.js';
import { Prime } from 'packages/contracts';
import { convertAprToApy } from 'utilities';

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
