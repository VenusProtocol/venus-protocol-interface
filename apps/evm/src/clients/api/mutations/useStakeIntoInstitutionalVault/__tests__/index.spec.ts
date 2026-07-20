import fakeAccountAddress from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { institutionalVaultAbi } from 'libs/contracts/abis/institutionalVaultAbi';
import { renderHook } from 'testUtils/render';
import type { Address } from 'viem';
import type { Mock } from 'vitest';
import { useStakeIntoInstitutionalVault } from '..';

const fakeVaultAddress = '0x2eDd4476485552C8fd3C66d795672E7627814F42' as Address;

// keccak256 of the tag-stripped English disclaimer (`vault.modals.institutionalTcsAgreement`),
// which is the text resolved in the test environment (default language).
const fakeEnglishConsentHash = '0x117fefe8334e998fb55a06a99e9b3d2793f3dda863f6d1b77bf5499390393cba';

const mockCaptureAnalyticEvent = vi.fn();

describe('useStakeIntoInstitutionalVault', () => {
  beforeEach(() => {
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));
  });

  it('calls depositWithConsent passing the amount, receiver and consent hash', async () => {
    renderHook(() => useStakeIntoInstitutionalVault({ vaultAddress: fakeVaultAddress }), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn({ amountMantissa: new BigNumber('12000000') })).toEqual({
      abi: institutionalVaultAbi,
      address: fakeVaultAddress,
      functionName: 'depositWithConsent',
      args: [12000000n, fakeAccountAddress, fakeEnglishConsentHash],
    });
  });

  it('captures analytics and invalidates institutional vault queries on confirmation', async () => {
    renderHook(() => useStakeIntoInstitutionalVault({ vaultAddress: fakeVaultAddress }), {
      accountAddress: fakeAccountAddress,
    });

    const { onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    await onConfirmed({});

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Institutional vault deposit', {
      vaultAddress: fakeVaultAddress,
      accountAddress: fakeAccountAddress,
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalled();
  });
});
