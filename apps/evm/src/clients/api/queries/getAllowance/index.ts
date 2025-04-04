import type { Address, PublicClient } from 'viem';

import BigNumber from 'bignumber.js';
import { erc20Abi } from 'libs/contracts';
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

export const getAllowance = async ({
  publicClient,
  token,
  accountAddress,
  spenderAddress,
}: GetAllowanceInput): Promise<GetAllowanceOutput> => {
  const allowanceMantissa = await publicClient.readContract({
    abi: erc20Abi,
    address: token.address,
    functionName: 'allowance',
    args: [accountAddress, spenderAddress],
  });

  return {
    allowanceMantissa: new BigNumber(allowanceMantissa.toString()),
  };
};
