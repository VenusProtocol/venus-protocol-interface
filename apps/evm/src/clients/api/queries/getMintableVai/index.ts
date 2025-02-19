import BigNumber from 'bignumber.js';
import { vaiAbi, vaiControllerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { Address, PublicClient } from 'viem';

export interface GetMintableVaiInput {
  accountAddress: Address;
  vaiControllerContractAddress: Address;
  vaiAddress: Address;
  publicClient: PublicClient;
}

export type GetMintableVaiOutput = {
  accountMintableVaiMantissa: BigNumber;
  vaiLiquidityMantissa: BigNumber;
};

export const getMintableVai = async ({
  accountAddress,
  vaiControllerContractAddress,
  vaiAddress,
  publicClient,
}: GetMintableVaiInput): Promise<GetMintableVaiOutput> => {
  const [mintCapResponse, vaiTotalSupplyResponse, accountMintableVaiResponse] =
    await publicClient.multicall({
      contracts: [
        {
          abi: vaiControllerAbi,
          address: vaiControllerContractAddress,
          functionName: 'mintCap',
        },
        {
          abi: vaiAbi,
          address: vaiAddress,
          functionName: 'totalSupply',
        },
        {
          abi: vaiControllerAbi,
          address: vaiControllerContractAddress,
          functionName: 'getMintableVAI',
          args: [accountAddress],
        },
      ],
    });

  if (
    mintCapResponse.status === 'failure' ||
    vaiTotalSupplyResponse.status === 'failure' ||
    accountMintableVaiResponse.status === 'failure'
  ) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  const vaiMintCapMantissa = new BigNumber(mintCapResponse.result.toString());
  const vaiTotalSupplyMantissa = new BigNumber(vaiTotalSupplyResponse.result.toString());
  const vaiLiquidityMantissa = vaiMintCapMantissa.minus(vaiTotalSupplyMantissa);

  const accountMintableVaiMantissa = new BigNumber(accountMintableVaiResponse.result[1].toString());

  return {
    vaiLiquidityMantissa,
    accountMintableVaiMantissa,
  };
};

export * from './useGetMintableVai';
