import { ContractTypeByName } from 'packages/contracts';

import fakeContractReceipt from '__mocks__/models/contractReceipt';

import createProposal from '.';

describe('api/mutation/createProposal', () => {
  test('returns contract receipt when request succeeds', async () => {
    const fakeTargets = ['0x32asdf'];
    const fakeSignatures = ['signature()'];
    const fakeCallDatas = ['callData'];
    const fakeDescription = 'Description';
    const proposalType = 0;

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const createProposalMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      propose: createProposalMock,
    } as unknown as ContractTypeByName<'governorBravoDelegate'>;

    const response = await createProposal({
      governorBravoContract: fakeContract,
      targets: fakeTargets,
      signatures: fakeSignatures,
      callDatas: fakeCallDatas,
      description: fakeDescription,
      proposalType,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(createProposalMock).toHaveBeenCalledTimes(1);
    expect(createProposalMock).toHaveBeenCalledWith(
      fakeTargets,
      Array(fakeSignatures.length).fill(0),
      fakeSignatures,
      fakeCallDatas,
      fakeDescription,
      proposalType,
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
