import { GovernorBravoDelegate } from 'packages/contracts';

import fakeContractReceipt from '__mocks__/models/contractReceipt';

import createProposal from '.';

describe('api/mutation/createProposal', () => {
  test('returns contract receipt when request succeeds', async () => {
    const fakeTargets = ['0x32asdf'];
    const fakeSignatures = ['signature()'];
    const fakeValues = ['0'];
    const fakeCallDatas = ['callData'];
    const fakeDescription = 'Description';
    const proposalType = 0;

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const createProposalMock = vi.fn(() => ({
      wait: waitMock,
    }));

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

    expect(response).toBe(fakeContractReceipt);
    expect(createProposalMock).toHaveBeenCalledTimes(1);
    expect(createProposalMock).toHaveBeenCalledWith(
      fakeTargets,
      fakeValues,
      fakeSignatures,
      fakeCallDatas,
      fakeDescription,
      proposalType,
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
