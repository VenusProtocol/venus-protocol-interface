import BigNumber from 'bignumber.js';
import { IsolatedPoolComptroller, LegacyPoolComptroller } from 'packages/contracts';

export interface GetHypotheticalAccountLiquidityInput {
  comptrollerContract: LegacyPoolComptroller | IsolatedPoolComptroller;
  accountAddress: string;
  vTokenAddress: string;
  vTokenBalanceOfMantissa: BigNumber;
  vTokenBorrowAmountMantissa?: BigNumber;
}

export type GetHypotheticalAccountLiquidityOutput = [BigNumber, BigNumber, BigNumber];

const getHypotheticalAccountLiquidity = async ({
  comptrollerContract,
  accountAddress,
  vTokenAddress,
  vTokenBalanceOfMantissa,
  vTokenBorrowAmountMantissa = new BigNumber(0),
}: GetHypotheticalAccountLiquidityInput): Promise<GetHypotheticalAccountLiquidityOutput> => {
  const res = await comptrollerContract.getHypotheticalAccountLiquidity(
    accountAddress.toLowerCase(),
    vTokenAddress,
    vTokenBalanceOfMantissa.toFixed(),
    vTokenBorrowAmountMantissa.toFixed(),
  );

  return [
    new BigNumber(res[0].toString()),
    new BigNumber(res[1].toString()),
    new BigNumber(res[2].toString()),
  ];
};
export default getHypotheticalAccountLiquidity;
