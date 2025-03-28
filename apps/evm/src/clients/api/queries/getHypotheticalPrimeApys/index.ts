import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { primeAbi } from 'libs/contracts';
import {
  convertAprBipsToApy,
  convertDollarsToCents,
  convertPriceMantissaToDollars,
} from 'utilities';

export interface GetHypotheticalPrimeApysInput {
  publicClient: PublicClient;
  primeContractAddress: Address;
  accountAddress: Address;
  vTokenAddress: Address;
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

export const getHypotheticalPrimeApys = async ({
  publicClient,
  primeContractAddress,
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
    borrowCapUSD,
    supplyCapUSD,
    totalScore,
    userScore,
  } = await publicClient.readContract({
    address: primeContractAddress,
    abi: primeAbi,
    functionName: 'estimateAPR',
    args: [
      vTokenAddress,
      accountAddress,
      BigInt(userBorrowBalanceMantissa.toFixed()),
      BigInt(userSupplyBalanceMantissa.toFixed()),
      BigInt(userXvsStakedMantissa.toFixed()),
    ],
  });

  // Convert APRs to APYs
  const supplyApyPercentage = convertAprBipsToApy({ aprBips: supplyAPR.toString() });
  const borrowApyPercentage = convertAprBipsToApy({ aprBips: borrowAPR.toString() });

  const supplyCapMantissa = new BigNumber(cappedSupply.toString());
  const borrowCapMantissa = new BigNumber(cappedBorrow.toString());

  const supplyCapUsd = convertPriceMantissaToDollars({
    priceMantissa: new BigNumber(supplyCapUSD.toString()),
    decimals: 18,
  });

  const supplyCapCents = convertDollarsToCents(supplyCapUsd);
  const borrowCapUsd = convertPriceMantissaToDollars({
    priceMantissa: new BigNumber(borrowCapUSD.toString()),
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
