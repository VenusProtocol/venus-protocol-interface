import { Prime } from 'packages/contracts';

export interface GetIsAddressPrimeInput {
  accountAddress: string;
  primeContract: Prime;
}

export type GetIsAddressPrimeOutput = {
  isPrime: boolean;
};

const getIsAddressPrime = async ({
  primeContract,
  accountAddress,
}: GetIsAddressPrimeInput): Promise<GetIsAddressPrimeOutput> => {
  const { exists: isPrime } = await primeContract.tokens(accountAddress);

  return {
    isPrime,
  };
};

export default getIsAddressPrime;
