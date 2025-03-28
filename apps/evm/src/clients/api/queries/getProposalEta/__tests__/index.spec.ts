import type { PublicClient } from 'viem';

import fakeGovernorBravoAddress, {
  altAddress as fakeProposerAddress,
} from '__mocks__/models/address';
import { getProposalEta } from '..';

const fakeProposalId = 123;

describe('getProposalEta', () => {
  test('returns ETA in correct format on success', async () => {
    const readContractMock = vi.fn(async () => [
      BigInt(0), // id
      fakeProposerAddress, // proposer
      BigInt(1657705706), // eta
      BigInt(0), // startBlock
      BigInt(0), // endBlock
      BigInt(0), // forVotes
      BigInt(0), // againstVotes
      BigInt(0), // abstainVotes
      false, // canceled
      false, // executed
      0, // proposalType
    ]);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getProposalEta({
      publicClient: fakePublicClient,
      governorBravoDelegateContractAddress: fakeGovernorBravoAddress,
      proposalId: fakeProposalId,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeGovernorBravoAddress,
      abi: expect.any(Object),
      functionName: 'proposals',
      args: [BigInt(fakeProposalId)],
    });
    expect(response).toMatchSnapshot();
  });
});
