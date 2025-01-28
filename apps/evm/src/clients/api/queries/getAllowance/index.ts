import type { Address, PublicClient } from 'viem';

import BigNumber from 'bignumber.js';
import { bep20Abi } from 'libs/contracts';
import type { Token } from 'types';

export interface GetAllowanceInput {
  publicClient: PublicClient;
  token: Token;
  accountAddress: Address;
  spenderAddress: Address;
}

export type GetAllowanceOutput = {
  allowanceMantissa: BigNumber;
};

const getAllowance = async ({
  publicClient,
  token,
  accountAddress,
  spenderAddress,
}: GetAllowanceInput): Promise<GetAllowanceOutput> => {
  const allowanceMantissa = await publicClient.readContract({
    abi: bep20Abi,
    address: token.address,
    functionName: 'allowance',
    args: [accountAddress, spenderAddress],
  });

  return {
    allowanceMantissa: new BigNumber(allowanceMantissa.toString()),
  };
};

export default getAllowance;
