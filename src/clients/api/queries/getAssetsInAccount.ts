import { Contract } from 'web3-eth-contract';

export interface IGetAssetsInAccountInput {
  comptrollerContract: Contract; // @TODO: use contract type (through Typechain?)
  account: string | undefined | null;
}

export type GetAssetsInAccountOutput = string[];

const getAssetsInAccount = ({ comptrollerContract, account }: IGetAssetsInAccountInput) =>
  comptrollerContract.methods.getAssetsIn(account?.toLowerCase()).call();

export default getAssetsInAccount;
