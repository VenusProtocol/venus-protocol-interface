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
  supplyCapMantissa: BigNumber;
  borrowCapMantissa: BigNumber;
  supplyCapUsd: BigNumber;
  borrowCapUsd: BigNumber;
  userPrimeRewardsShare: BigNumber;
}

const getHypotheticalPrimeApys = async ({
  primeContract,
  vTokenAddress,
  accountAddress,
  userBorrowBalanceMantissa,
  userSupplyBalanceMantissa,
  userXvsStakedMantissa,
}: GetHypotheticalPrimeApysInput): Promise<GetHypotheticalPrimeApysOutput> => {
  const data = await primeContract.estimateAPR(
    vTokenAddress,
    accountAddress,
    userBorrowBalanceMantissa.toFixed(),
    userSupplyBalanceMantissa.toFixed(),
    userXvsStakedMantissa.toFixed(),
  );

  const {
    borrowAPR,
    supplyAPR,
    cappedSupply,
    cappedBorrow,
    borrowCapUSD,
    supplyCapUSD,
    totalScore,
    userScore,
  } = data;

  // Convert APRs to APYs
  const supplyApyPercentage = convertAprToApy({ aprBips: supplyAPR.toString() });
  const borrowApyPercentage = convertAprToApy({ aprBips: borrowAPR.toString() });

  const supplyCapMantissa = new BigNumber(cappedSupply.toString());
  const borrowCapMantissa = new BigNumber(cappedBorrow.toString());

  const supplyCapUsd = new BigNumber(supplyCapUSD.toString());
  const borrowCapUsd = new BigNumber(borrowCapUSD.toString());

  const userScoreBN = new BigNumber(userScore.toString());
  const totalScoreBN = new BigNumber(totalScore.toString());
  const userPrimeRewardsShare = new BigNumber(userScoreBN.dividedBy(totalScoreBN).toString());

  return {
    supplyApyPercentage,
    borrowApyPercentage,
    supplyCapMantissa,
    borrowCapMantissa,
    supplyCapUsd,
    borrowCapUsd,
    userPrimeRewardsShare,
  };
};

export default getHypotheticalPrimeApys;
