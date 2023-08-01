import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetXvsWithdrawableAmountInput {
  accountAddress: string;
  xvsVestingContract?: ContractTypeByName<'xvsVesting'>;
}

export interface GetXvsWithdrawableAmountOutput {
  totalWithdrawableAmount: BigNumber;
  totalVestedAmount: BigNumber;
  totalWithdrawnAmount: BigNumber;
}

const getXvsWithdrawableAmount = async ({
  xvsVestingContract,
  accountAddress,
}: GetXvsWithdrawableAmountInput): Promise<GetXvsWithdrawableAmountOutput | undefined> => {
  if (!xvsVestingContract) {
    return undefined;
  }

  const resp = await xvsVestingContract.getWithdrawableAmount(accountAddress);

  return {
    totalWithdrawableAmount: new BigNumber(resp.totalWithdrawableAmount.toString()),
    totalVestedAmount: new BigNumber(resp.totalVestedAmount.toString()),
    totalWithdrawnAmount: new BigNumber(resp.totalWithdrawnAmount.toString()),
  };
};

export default getXvsWithdrawableAmount;
