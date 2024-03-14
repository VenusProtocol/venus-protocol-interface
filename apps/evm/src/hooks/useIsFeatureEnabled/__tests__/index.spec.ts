import type Vi from 'vitest';

import { useChainId } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';

import { type FeatureFlag, featureFlags, useIsFeatureEnabled } from '..';

vi.unmock('hooks/useIsFeatureEnabled');

describe('useIsFeatureEnabled', () => {
  it.each(Object.entries(featureFlags))(
    'returns the correct boolean on all networks: %s',
    (featureName, enabledChainIds) => {
      Object.values(ChainId)
        .filter((value): value is ChainId => !Number.isNaN(+value))
        .forEach(chainId => {
          (useChainId as Vi.Mock).mockImplementation(() => ({
            chainId,
          }));

          const { result } = renderHook(() =>
            useIsFeatureEnabled({
              name: featureName as FeatureFlag,
            }),
          );

          const expectedResult = enabledChainIds.includes(chainId);
          expect(result.current).toBe(expectedResult);
        });
    },
  );
});
