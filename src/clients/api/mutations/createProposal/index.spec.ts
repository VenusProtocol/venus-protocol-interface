import fakeContractTransaction from '__mocks__/models/contractTransaction';

import { GovernorBravoDelegate } from 'packages/contracts';

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

    const response = await createProposal({
      governorBravoDelegateContract: fakeContract,
      targets: fakeTargets,
      signatures: fakeSignatures,
      values: fakeValues,
      callDatas: fakeCallDatas,
      description: fakeDescription,
      proposalType,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(createProposalMock).toHaveBeenCalledTimes(1);
    expect(createProposalMock).toHaveBeenCalledWith(
      fakeTargets,
      fakeValues,
      fakeSignatures,
      fakeCallDatas,
      fakeDescription,
      proposalType,
    );
  });
});
