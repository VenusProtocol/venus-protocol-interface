import { XvsVesting } from 'types/contracts';
import getXvsWithdrawableAmount, {
  IGetXvsWithdrawableAmountOutput,
} from './getXvsWithdrawableAmount';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

describe('api/queries/getXvsBalance', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getWithdrawableAmount: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVesting;

    try {
      await getXvsWithdrawableAmount({
        xvsVestingContract: fakeContract,
        accountAddress: fakeAccountAddress,
      });

      throw new Error('getXvsBalanceOf should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the conversion end time on success', async () => {
    const fakeOutput: IGetXvsWithdrawableAmountOutput = {
      totalWithdrawableAmount: '500000',
      totalVestedAmount: '1000',
      totalWithdrawnAmount: '0',
    };

    const callMock = jest.fn(async () => fakeOutput);
    const xvsWithdrawableAmountMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        getWithdrawableAmount: xvsWithdrawableAmountMock,
      },
    } as unknown as XvsVesting;

    const response = await getXvsWithdrawableAmount({
      xvsVestingContract: fakeContract,
      accountAddress: fakeAccountAddress,
    });

    expect(xvsWithdrawableAmountMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(xvsWithdrawableAmountMock).toHaveBeenCalledWith(fakeAccountAddress);
    expect(response).toBe(fakeOutput);
  });
});
