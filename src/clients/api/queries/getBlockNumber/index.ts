import Web3 from 'web3';

export interface GetBlockNumberInput {
  web3: Web3;
}

export interface GetBlockNumberOutput {
  blockNumber: number;
}

const getBlockNumber = async ({ web3 }: GetBlockNumberInput): Promise<GetBlockNumberOutput> => {
  const blockNumber = await web3.eth.getBlockNumber();

  return {
    blockNumber,
  };
};

export default getBlockNumber;
