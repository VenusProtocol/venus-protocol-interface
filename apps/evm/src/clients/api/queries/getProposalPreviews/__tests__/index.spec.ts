import fakeAccountAddress from '__mocks__/models/address';
import { ChainId } from 'types';
import { getProposalPreviews } from '..';

describe('getProposalPreviews', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1710401645000));
  });

  it('returns proposal previews in the correct format', async () => {
    const res = await getProposalPreviews({
      chainId: ChainId.BSC_TESTNET,
      currentBlockNumber: 1,
      blockTimeMs: 3000,
      accountAddress: fakeAccountAddress,
    });

    expect(res).toMatchSnapshot();
  });
});
