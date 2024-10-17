import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { GovernorBravoDelegate } from 'libs/contracts';

import createProposal from '.';

describe('createProposal', () => {
  test('returns contract transaction when request succeeds', async () => {
    const fakeTargets = ['0x32asdf'];
    const fakeSignatures = ['signature()'];
    const fakeValues = ['0'];
    const fakeCallDatas = ['callData'];
    const fakeDescription = 'Description';
    const proposalType = 0;

    const createProposalMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      propose: createProposalMock,
    } as unknown as GovernorBravoDelegate;

    const response = createProposal({
      governorBravoDelegateContract: fakeContract,
      targets: fakeTargets,
      signatures: fakeSignatures,
      values: fakeValues,
      callDatas: fakeCallDatas,
      description: fakeDescription,
      proposalType,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [fakeTargets, fakeValues, fakeSignatures, fakeCallDatas, fakeDescription, proposalType],
      methodName: 'propose',
    });
  });
});
