import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { Comptroller } from 'types/contracts';
import claimVenus from './claimVenus';

const fakeTokenAddresses = ['0x3d759121234cd36F8124C21aFe1c6852d2bEd848'];
const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

describe('api/mutation/claimVenus', () => {
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
      await claimVenus({
        comptrollerContract: fakeContract,
        tokenAddresses: fakeTokenAddresses,
        fromAccountAddress: fakeFromAccountsAddress,
      });

      throw new Error('claimVenus should have thrown an error but did not');
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

    const response = await claimVenus({
      comptrollerContract: fakeContract,
      tokenAddresses: fakeTokenAddresses,
      fromAccountAddress: fakeFromAccountsAddress,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(claimVenusMock).toHaveBeenCalledTimes(1);
    expect(claimVenusMock).toHaveBeenCalledWith(fakeFromAccountsAddress, fakeTokenAddresses);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
