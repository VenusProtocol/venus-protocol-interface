import type Vi from 'vitest';

import { renderHook } from 'testUtils/render';

import { zeroXApiUrl } from 'constants/swap';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { useZeroXApiUrl } from '..';

describe('useZeroXApiUrl', () => {
  it.each(Object.values(ChainId).filter((value): value is ChainId => !Number.isNaN(+value)))(
    'returns the correct API URL for the chain ID: %s',
    chainId => {
      (useChainId as Vi.Mock).mockImplementation(() => ({
        chainId,
      }));

      const { result } = renderHook(() => useZeroXApiUrl());
      expect(result.current).toBe(zeroXApiUrl[chainId as keyof typeof zeroXApiUrl]);
    },
  );
});
