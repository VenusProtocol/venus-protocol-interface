import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';
import { liquidityHubAbi } from 'libs/contracts';

import { getLiquidityHubOperatorAddress } from '..';

describe('getLiquidityHubOperatorAddress', () => {
  it('returns the operator address in the right format on success', async () => {
    const readContractMock = vi.fn().mockResolvedValue(fakeAddress);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const res = await getLiquidityHubOperatorAddress({
      publicClient: fakePublicClient,
      vhTokenAddress: fakeAddress,
    });

    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: liquidityHubAbi,
      functionName: 'owner',
    });
    expect(res).toMatchSnapshot();
  });
});
