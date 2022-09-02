import fakeAddress from '__mocks__/models/address';
import { GovernorBravoDelegate } from 'types/contracts';

import createProposal from '.';

describe('api/mutation/createProposal', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        propose: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as GovernorBravoDelegate;

    try {
      await createProposal({
        governorBravoContract: fakeContract,
        accountAddress: '0x32asdf',
        targets: ['0x32asdf'],
        signatures: ['signature()'],
        callDatas: ['callData'],
        description: 'Description',
      });

      throw new Error('createProposal should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns Receipt when request succeeds', async () => {
    const fakeTransactionReceipt = { events: {} };
    const fakeTargets = ['0x32asdf'];
    const fakeSignatures = ['signature()'];
    const fakeCallDatas = ['callData'];
    const fakeDescription = 'Description';
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const createProposalMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        propose: createProposalMock,
      },
    } as unknown as GovernorBravoDelegate;

    const response = await createProposal({
      governorBravoContract: fakeContract,
      accountAddress: fakeAddress,
      targets: fakeTargets,
      signatures: fakeSignatures,
      callDatas: ['callData'],
      description: fakeDescription,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(createProposalMock).toHaveBeenCalledTimes(1);
    expect(createProposalMock).toHaveBeenCalledWith(
      fakeTargets,
      Array(fakeSignatures.length).fill(0),
      fakeSignatures,
      fakeCallDatas,
      fakeDescription,
    );
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAddress });
  });
});
