import BigNumber from 'bignumber.js';

import { Comptroller } from 'types/contracts';

export interface IGetHypotheticalAccountLiquidityInput {
  comptrollerContract: Comptroller;
  accountAddress: string;
  vTokenAddress: string;
  vTokenBalanceOfWei: BigNumber;
  vTokenBorrowAmountWei?: BigNumber;
}

export type GetHypotheticalAccountLiquidityOutput = { 0: string; 1: string; 2: string };

const getHypotheticalAccountLiquidity = ({
  comptrollerContract,
  accountAddress,
  vTokenAddress,
  vTokenBalanceOfWei,
  vTokenBorrowAmountWei = new BigNumber(0),
}: IGetHypotheticalAccountLiquidityInput): Promise<GetHypotheticalAccountLiquidityOutput> =>
  comptrollerContract.methods
    .getHypotheticalAccountLiquidity(
      accountAddress.toLowerCase(),
      vTokenAddress,
      vTokenBalanceOfWei.toFixed(),
      vTokenBorrowAmountWei.toFixed(),
    )
    .call();

export default getHypotheticalAccountLiquidity;
