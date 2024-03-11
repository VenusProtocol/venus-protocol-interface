import type { VaiVault } from 'libs/contracts';

import { getVaiVaultPaused } from '..';

describe('getVaiVaultPaused', () => {
  test('returns whether the vault is paused, on success', async () => {
    const vaultPausedMock = vi.fn(async () => true);

    const fakeContract = {
      vaultPaused: vaultPausedMock,
    } as unknown as VaiVault;

    const response = await getVaiVaultPaused({
      vaiVaultContract: fakeContract,
    });

    expect(vaultPausedMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });
});
