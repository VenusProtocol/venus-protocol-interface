export interface IGetAssetsInAccountInput {
  comptrollerContract: $TSFixMe; // @TODO: use contract type (through Typechain?)
  account: string | undefined | null;
}

export type GetAssetsInAccountOutput = string[];

const getAssetsInAccount = ({
  comptrollerContract,
  account,
}: IGetAssetsInAccountInput): Promise<GetAssetsInAccountOutput> =>
  comptrollerContract.methods.getAssetsIn(account?.toLowerCase()).call();

export default getAssetsInAccount;
