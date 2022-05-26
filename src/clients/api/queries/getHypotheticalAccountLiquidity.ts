import BigNumber from 'bignumber.js';

export interface IGetHypotheticalAccountLiquidityInput {
  comptrollerContract: $TSFixMe; // @TODO: use contract type (through Typechain?)
  accountAddress: string;
  vtokenAddress: string;
  balanceOf: string;
  borrowAmount?: number | BigNumber;
}

export type GetHypotheticalAccountLiquidityOutput = number;

const getHypotheticalAccountLiquidity = ({
  comptrollerContract,
  accountAddress,
  vtokenAddress,
  balanceOf,
  borrowAmount = 0,
}: IGetHypotheticalAccountLiquidityInput): Promise<GetHypotheticalAccountLiquidityOutput> =>
  comptrollerContract.methods
    .getHypotheticalAccountLiquidity(
      accountAddress.toLowerCase(),
      vtokenAddress,
      balanceOf,
      borrowAmount,
    )
    .call();

export default getHypotheticalAccountLiquidity;
