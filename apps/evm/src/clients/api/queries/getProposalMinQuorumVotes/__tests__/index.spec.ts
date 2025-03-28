import fakeGovernorBravoAddress from '__mocks__/models/address';
import type { PublicClient } from 'viem';

import { getProposalMinQuorumVotes } from '..';

describe('getProposalMinQuorumVotes', () => {
  test('returns proposal min quorum votes on success', async () => {
    const fakeOutput = 1000000000000000000n;

    const readContractMock = vi.fn(async () => fakeOutput);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getProposalMinQuorumVotes({
      governorBravoDelegateContractAddress: fakeGovernorBravoAddress,
      publicClient: fakePublicClient,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      abi: expect.any(Object),
      address: fakeGovernorBravoAddress,
      functionName: 'quorumVotes',
    });
    expect(response).toMatchSnapshot();
  });
});
