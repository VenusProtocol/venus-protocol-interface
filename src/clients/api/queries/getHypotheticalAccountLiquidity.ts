import BigNumber from 'bignumber.js';

export interface IGetHypotheticalAccountLiquidityInput {
  comptrollerContract: $TSFixMe; // @TODO: use contract type (through Typechain?)
  account: string | undefined | null;
  vtokenAddress: string;
  balanceOf: string;
  borrowAmount?: number | BigNumber;
}

export type GetHypotheticalAccountLiquidityOutput = number;

const getHypotheticalAccountLiquidity = ({
  comptrollerContract,
  account,
  vtokenAddress,
  balanceOf,
  borrowAmount = 0,
}: IGetHypotheticalAccountLiquidityInput): Promise<GetHypotheticalAccountLiquidityOutput> =>
  comptrollerContract.methods
    .getHypotheticalAccountLiquidity(account?.toLowerCase(), vtokenAddress, balanceOf, borrowAmount)
    .call();

export default getHypotheticalAccountLiquidity;
