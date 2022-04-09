import { Contract } from 'web3-eth-contract';

export interface IExitMarketInput {
  comptrollerContract: Contract; // @TODO: use contract type (through Typechain?)
  account: string | undefined | null;
  vtokenAddress: string;
}

export type ExitMarketOutput = void;

const exitMarket = ({
  comptrollerContract,
  account,
  vtokenAddress,
}: IExitMarketInput): Promise<ExitMarketOutput> =>
  comptrollerContract.methods.exitMarket(vtokenAddress).send({ from: account });

export default exitMarket;
