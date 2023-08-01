import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

const xvsVestingResponses: {
  withdrawableAmount: Awaited<
    ReturnType<ContractTypeByName<'xvsVesting'>['getWithdrawableAmount']>
  >;
} = {
  withdrawableAmount: {
    totalWithdrawableAmount: BN.from('500000'),
    totalVestedAmount: BN.from('1000'),
    totalWithdrawnAmount: BN.from('0'),
  } as Awaited<ReturnType<ContractTypeByName<'xvsVesting'>['getWithdrawableAmount']>>,
};

export default xvsVestingResponses;
