import { ContractTypeByName } from 'packages/contracts';

import xvsVestingResponses from '__mocks__/contracts/xvsVesting';

import getXvsWithdrawableAmount from '.';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

describe('api/queries/getXvsWithdrawableAmount', () => {
  test('returns the withdrawable amount on success', async () => {
    const xvsWithdrawableAmountMock = vi.fn(async () => xvsVestingResponses.withdrawableAmount);

    const fakeContract = {
      getWithdrawableAmount: xvsWithdrawableAmountMock,
    } as unknown as ContractTypeByName<'xvsVesting'>;

    const response = await getXvsWithdrawableAmount({
      xvsVestingContract: fakeContract,
      accountAddress: fakeAccountAddress,
    });

    expect(xvsWithdrawableAmountMock).toHaveBeenCalledTimes(1);
    expect(xvsWithdrawableAmountMock).toHaveBeenCalledWith(fakeAccountAddress);
    expect(response).toMatchSnapshot();
  });

  test('returns undefined when not passing xvsVestingContract parameter', async () => {
    const xvsWithdrawableAmountMock = vi.fn(async () => xvsVestingResponses.withdrawableAmount);

    const response = await getXvsWithdrawableAmount({
      accountAddress: fakeAccountAddress,
    });

    expect(xvsWithdrawableAmountMock).not.toHaveBeenCalled();
    expect(response).toBe(undefined);
  });
});
