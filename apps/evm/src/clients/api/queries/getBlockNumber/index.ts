import type { PublicClient } from 'viem';

export interface GetBlockNumberInput {
  publicClient: PublicClient;
}

export interface GetBlockNumberOutput {
  blockNumber: number;
}

const getBlockNumber = async ({
  publicClient,
}: GetBlockNumberInput): Promise<GetBlockNumberOutput> => {
  const blockNumber = await publicClient.getBlockNumber();

  return {
    blockNumber: +blockNumber.toString(),
  };
};

export default getBlockNumber;
