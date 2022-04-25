import { IAccount } from 'context/AuthContext';

export interface IExitMarketInput {
  comptrollerContract: $TSFixMe; // @TODO: use contract type (through Typechain?)
  account: IAccount;
  vtokenAddress: string;
}

export type ExitMarketOutput = void;

const exitMarket = ({
  comptrollerContract,
  account,
  vtokenAddress,
}: IExitMarketInput): Promise<ExitMarketOutput> =>
  comptrollerContract.methods.exitMarket(vtokenAddress).send({ from: account.address });

export default exitMarket;
