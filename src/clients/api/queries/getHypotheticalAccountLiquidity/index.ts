import BigNumber from 'bignumber.js';
import { IsolatedPoolComptroller, MainPoolComptroller } from 'packages/contractsNew';

export interface GetHypotheticalAccountLiquidityInput {
  comptrollerContract: MainPoolComptroller | IsolatedPoolComptroller;
  accountAddress: string;
  vTokenAddress: string;
  vTokenBalanceOfWei: BigNumber;
  vTokenBorrowAmountWei?: BigNumber;
}

export type GetHypotheticalAccountLiquidityOutput = [BigNumber, BigNumber, BigNumber];

const getHypotheticalAccountLiquidity = async ({
  comptrollerContract,
  accountAddress,
  vTokenAddress,
  vTokenBalanceOfWei,
  vTokenBorrowAmountWei = new BigNumber(0),
}: GetHypotheticalAccountLiquidityInput): Promise<GetHypotheticalAccountLiquidityOutput> => {
  const res = await comptrollerContract.getHypotheticalAccountLiquidity(
    accountAddress.toLowerCase(),
    vTokenAddress,
    vTokenBalanceOfWei.toFixed(),
    vTokenBorrowAmountWei.toFixed(),
  );

  return [
    new BigNumber(res[0].toString()),
    new BigNumber(res[1].toString()),
    new BigNumber(res[2].toString()),
  ];
};
export default getHypotheticalAccountLiquidity;
