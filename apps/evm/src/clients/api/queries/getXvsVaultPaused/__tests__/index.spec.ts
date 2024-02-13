import { XvsVault } from 'libs/contracts';

import { getXvsVaultPaused } from '..';

describe('getVaiVaultPaused', () => {
  test('returns whether the vault is paused, on success', async () => {
    const vaultPausedMock = vi.fn(async () => true);

    const fakeContract = {
      vaultPaused: vaultPausedMock,
    } as unknown as XvsVault;

    const response = await getXvsVaultPaused({
      xvsVaultContract: fakeContract,
    });

    expect(vaultPausedMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });
});
