import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import address from '__mocks__/models/address';
import { Comptroller } from 'types/contracts';
import claimXvsReward from './claimXvsReward';

const fakeTokenAddresses = [address];

describe('api/mutation/claimXvsReward', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        'claimVenus(address,address[])': () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as Comptroller;

    try {
      await claimXvsReward({
        comptrollerContract: fakeContract,
        tokenAddresses: fakeTokenAddresses,
        fromAccountAddress: address,
      });

      throw new Error('claimXvsReward should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns transaction receipt when request succeeds', async () => {
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const claimVenusMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        'claimVenus(address,address[])': claimVenusMock,
      },
    } as unknown as Comptroller;

    const response = await claimXvsReward({
      comptrollerContract: fakeContract,
      tokenAddresses: fakeTokenAddresses,
      fromAccountAddress: address,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(claimVenusMock).toHaveBeenCalledTimes(1);
    expect(claimVenusMock).toHaveBeenCalledWith(address, fakeTokenAddresses);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: address });
  });
});
