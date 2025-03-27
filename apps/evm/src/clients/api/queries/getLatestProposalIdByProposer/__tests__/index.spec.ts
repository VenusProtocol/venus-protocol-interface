import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { getLatestProposalIdByProposer } from '..';

describe('getLatestProposalIdByProposer', () => {
  test('returns latest proposalId on success', async () => {
    const fakeOutput = 1n;
    const fakeGovernorBravoAddress = '0x00000000000000000000000000000000GoVeRnOr';

    const readContractMock = vi.fn(async () => fakeOutput);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getLatestProposalIdByProposer({
      governorBravoDelegateContractAddress: fakeGovernorBravoAddress,
      publicClient: fakePublicClient,
      accountAddress: fakeAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      abi: expect.any(Object),
      address: fakeGovernorBravoAddress,
      functionName: 'latestProposalIds',
      args: [fakeAddress],
    });
    expect(response).toStrictEqual({
      proposalId: fakeOutput.toString(),
    });
  });
});
