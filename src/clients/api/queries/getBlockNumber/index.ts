import { type Provider } from 'clients/web3';

export interface GetBlockNumberInput {
  provider: Provider;
}

export interface GetBlockNumberOutput {
  blockNumber: number;
}

const getBlockNumber = async ({ provider }: GetBlockNumberInput): Promise<GetBlockNumberOutput> => {
  const blockNumber = await provider.getBlockNumber();

  return {
    blockNumber,
  };
};

export default getBlockNumber;
