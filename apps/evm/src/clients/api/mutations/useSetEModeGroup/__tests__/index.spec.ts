import fakeAccountAddress from '__mocks__/models/address';
import { vBusdCorePool } from '__mocks__/models/vTokens';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Address } from 'viem';
import type { Mock } from 'vitest';
import { type SetEModeGroupInput, useSetEModeGroup } from '..';

const fakeBaseInput = {
  vToken: vBusdCorePool,
  comptrollerContractAddress: '0xfakeComptrollerContractAddress' as Address,
};

const fakeOptions = {
  gasless: false,
  waitForConfirmation: true,
  onError: expect.any(Function),
};

describe('useSetEModeGroup', () => {
  it.each([
    [
      'enabling',
      {
        eModeGroupId: 1,
        eModeGroupName: 'Stablecoins',
        userEModeGroupName: undefined,
      },
    ],
    [
      'switching',
      {
        eModeGroupId: 1,
        eModeGroupName: 'Stablecoins',
        userEModeGroupName: 'DeFi',
      },
    ],
    [
      'disabling',
      {
        eModeGroupId: 0,
        eModeGroupName: undefined,
        userEModeGroupName: 'DeFi',
      },
    ],
  ])(
    'calls useSendTransaction with the correct parameters when %s E-mode group',
    async (_action, input) => {
      const mockCaptureAnalyticEvent = vi.fn();
      (useAnalytics as Mock).mockImplementation(() => ({
        captureAnalyticEvent: mockCaptureAnalyticEvent,
      }));

      renderHook(() => useSetEModeGroup(fakeOptions), {
        accountAddress: fakeAccountAddress,
      });

      expect(useSendTransaction).toHaveBeenCalledWith({
        fn: expect.any(Function),
        onConfirmed: expect.any(Function),
        onSigned: expect.any(Function),
        options: fakeOptions,
      });

      const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

      const fakeInput: SetEModeGroupInput = {
        ...fakeBaseInput,
        ...input,
      };

      expect(await fn(fakeInput)).toEqual({
        abi: expect.any(Array),
        address: fakeInput.comptrollerContractAddress,
        functionName: 'enterPool',
        args: [BigInt(fakeInput.eModeGroupId)],
      });

      onConfirmed({ input: fakeInput });

      expect(mockCaptureAnalyticEvent.mock.calls).toMatchSnapshot();
    },
  );
});
