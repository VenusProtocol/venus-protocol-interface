import { Contract } from 'web3-eth-contract';

export interface IEnterMarketsInput {
  comptrollerContract: Contract; // @TODO: use contract type (through Typechain?)
  account: string | undefined | null;
  vtokenAddresses: string[];
}

export type EnterMarketsOutput = void;

const enterMarkets = ({
  comptrollerContract,
  account,
  vtokenAddresses,
}: IEnterMarketsInput): Promise<EnterMarketsOutput> =>
  comptrollerContract.methods.enterMarkets(vtokenAddresses).send({ from: account });

export default enterMarkets;
