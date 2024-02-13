import BigNumber from 'bignumber.js';

import { Prime } from 'libs/contracts';
import { convertAprToApy, convertDollarsToCents, convertPriceMantissaToDollars } from 'utilities';

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
  supplyCapCents: BigNumber;
  borrowCapCents: BigNumber;
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
  const {
    borrowAPR,
    supplyAPR,
    cappedSupply,
    cappedBorrow,
    borrowCapUSD: borrowCapPriceMantissa,
    supplyCapUSD: supplyCapPriceMantissa,
    totalScore,
    userScore,
  } = await primeContract.estimateAPR(
    vTokenAddress,
    accountAddress,
    userBorrowBalanceMantissa.toFixed(),
    userSupplyBalanceMantissa.toFixed(),
    userXvsStakedMantissa.toFixed(),
  );

  // Convert APRs to APYs
  const supplyApyPercentage = convertAprToApy({ aprBips: supplyAPR.toString() });
  const borrowApyPercentage = convertAprToApy({ aprBips: borrowAPR.toString() });

  const supplyCapMantissa = new BigNumber(cappedSupply.toString());
  const borrowCapMantissa = new BigNumber(cappedBorrow.toString());

  const supplyCapUsd = convertPriceMantissaToDollars({
    priceMantissa: new BigNumber(supplyCapPriceMantissa.toString()),
    decimals: 18,
  });

  const supplyCapCents = convertDollarsToCents(supplyCapUsd);
  const borrowCapUsd = convertPriceMantissaToDollars({
    priceMantissa: new BigNumber(borrowCapPriceMantissa.toString()),
    decimals: 18,
  });

  const borrowCapCents = convertDollarsToCents(borrowCapUsd);

  const userScoreBN = new BigNumber(userScore.toString());
  const totalScoreBN = new BigNumber(totalScore.toString());
  const userPrimeRewardsShare = new BigNumber(userScoreBN.dividedBy(totalScoreBN).toString());

  return {
    supplyApyPercentage,
    borrowApyPercentage,
    supplyCapMantissa,
    borrowCapMantissa,
    supplyCapCents,
    borrowCapCents,
    userPrimeRewardsShare,
  };
};

export default getHypotheticalPrimeApys;
