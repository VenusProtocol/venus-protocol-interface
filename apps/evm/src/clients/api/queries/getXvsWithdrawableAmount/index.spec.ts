import xvsVestingResponses from '__mocks__/contracts/xvsVesting';

import type { XvsVesting } from 'libs/contracts';

import getXvsWithdrawableAmount from '.';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

describe('api/queries/getXvsWithdrawableAmount', () => {
  test('returns the withdrawable amount on success', async () => {
    const xvsWithdrawableAmountMock = vi.fn(async () => xvsVestingResponses.withdrawableAmount);

    const fakeContract = {
      getWithdrawableAmount: xvsWithdrawableAmountMock,
    } as unknown as XvsVesting;

    const response = await getXvsWithdrawableAmount({
      xvsVestingContract: fakeContract,
      accountAddress: fakeAccountAddress,
    });

    expect(xvsWithdrawableAmountMock).toHaveBeenCalledTimes(1);
    expect(xvsWithdrawableAmountMock).toHaveBeenCalledWith(fakeAccountAddress);
    expect(response).toMatchSnapshot();
  });
});
