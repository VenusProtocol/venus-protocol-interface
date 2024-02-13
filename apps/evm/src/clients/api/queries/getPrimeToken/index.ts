import { Prime } from 'libs/contracts';

export interface GetPrimeTokenInput {
  accountAddress: string;
  primeContract: Prime;
}

export type GetPrimeTokenOutput = {
  exists: boolean;
  isIrrevocable: boolean;
};

const getPrimeToken = async ({
  primeContract,
  accountAddress,
}: GetPrimeTokenInput): Promise<GetPrimeTokenOutput> => {
  const { exists, isIrrevocable } = await primeContract.tokens(accountAddress);

  return {
    exists,
    isIrrevocable,
  };
};

export default getPrimeToken;
