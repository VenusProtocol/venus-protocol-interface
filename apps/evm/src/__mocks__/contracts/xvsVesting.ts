import { BigNumber as BN } from 'ethers';
import { XvsVesting } from 'libs/contracts';

const xvsVestingResponses: {
  withdrawableAmount: Awaited<ReturnType<XvsVesting['getWithdrawableAmount']>>;
} = {
  withdrawableAmount: {
    totalWithdrawableAmount: BN.from('500000'),
    totalVestedAmount: BN.from('1000'),
    totalWithdrawnAmount: BN.from('0'),
  } as Awaited<ReturnType<XvsVesting['getWithdrawableAmount']>>,
};

export default xvsVestingResponses;
