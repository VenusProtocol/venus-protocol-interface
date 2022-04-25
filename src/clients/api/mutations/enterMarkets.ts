import { IAccount } from 'context/AuthContext';

export interface IEnterMarketsInput {
  comptrollerContract: $TSFixMe; // @TODO: use contract type (through Typechain?)
  account: IAccount;
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
