export interface IExitMarketInput {
  comptrollerContract: $TSFixMe; // @TODO: use contract type (through Typechain?)
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
