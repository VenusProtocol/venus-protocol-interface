import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import address from '__mocks__/models/address';
import { Comptroller, VenusLens } from 'types/contracts';
import { VBEP_TOKENS } from 'constants/tokens';
import getVTokenBalancesAll from '../queries/getVTokenBalancesAll';
import claimXvsReward from './claimXvsReward';

jest.mock('../queries/getVTokenBalancesAll');

const fakeVenusLensContract = {} as unknown as VenusLens;

describe('api/mutation/claimXvsReward', () => {
  test('throws an error when request fails', async () => {
    (getVTokenBalancesAll as jest.Mock).mockImplementationOnce(async () => []);

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
        venusLensContract: fakeVenusLensContract,
        fromAccountAddress: address,
      });

      throw new Error('claimXvsReward should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('send claim request with correct arguments and returns transaction receipt when request succeeds', async () => {
    (getVTokenBalancesAll as jest.Mock).mockImplementationOnce(async () => [
      {
        balanceOf: '0',
        balanceOfUnderlying: '0',
        borrowBalanceCurrent: '0',
        tokenAllowance: '0',
        tokenBalance: '0',
        vToken: VBEP_TOKENS.aave.address,
      },
      {
        balanceOf: '0',
        balanceOfUnderlying: '0',
        borrowBalanceCurrent: '20000000',
        tokenAllowance: '0',
        tokenBalance: '0',
        vToken: VBEP_TOKENS.btcb.address,
      },
      {
        balanceOf: '0',
        balanceOfUnderlying: '100000000',
        borrowBalanceCurrent: '0',
        tokenAllowance: '0',
        tokenBalance: '0',
        vToken: VBEP_TOKENS.bnb.address,
      },
    ]);

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
      venusLensContract: fakeVenusLensContract,
      fromAccountAddress: address,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(claimVenusMock).toHaveBeenCalledTimes(1);

    // Only tokens for which borrowBalanceCurrent or/and balanceOfUnderlying
    // is/are positive should be sent in the claim
    const expectedVTokenAddresses = [VBEP_TOKENS.btcb.address, VBEP_TOKENS.bnb.address];
    expect(claimVenusMock).toHaveBeenCalledWith(address, expectedVTokenAddresses);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: address });
  });
});
