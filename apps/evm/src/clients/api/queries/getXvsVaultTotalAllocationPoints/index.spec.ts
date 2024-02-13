import { BigNumber as BN } from 'ethers';

import { XvsVault } from 'libs/contracts';

import getXvsVaultTotalAllocationPoints from '.';

const fakeTokenAddress = '0x0';

describe('api/queries/getXvsVaultTotalAllocationPoints', () => {
  test('returns the total allocation points on success', async () => {
    const fakeOutput = BN.from('100');

    const totalAllocPointsMock = vi.fn(async () => fakeOutput);

    const fakeContract = {
      totalAllocPoints: totalAllocPointsMock,
    } as unknown as XvsVault;

    const response = await getXvsVaultTotalAllocationPoints({
      xvsVaultContract: fakeContract,
      tokenAddress: fakeTokenAddress,
    });

    expect(totalAllocPointsMock).toHaveBeenCalledTimes(1);
    expect(totalAllocPointsMock).toHaveBeenCalledWith(fakeTokenAddress);
    expect(response).toEqual({
      totalAllocationPoints: fakeOutput.toNumber(),
    });
  });
});
