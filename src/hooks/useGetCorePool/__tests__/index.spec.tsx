import Vi from 'vitest';

import fakeAccountAddress, {
  altAddress as fakeCorePoolComptrollerContractAddress,
} from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { renderHook } from 'testUtils/render';

import { useGetPool } from 'clients/api';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

import { useGetCorePool } from '..';

vi.mock('hooks/useGetChainMetadata');

describe('useGetCorePool', () => {
  it('returns the correct pool', () => {
    (useGetChainMetadata as Vi.Mock).mockImplementation(() => ({
      corePoolComptrollerContractAddress: fakeCorePoolComptrollerContractAddress,
    }));

    const fakeOutput = {
      data: {
        pool: poolData[0],
      },
    };
    (useGetPool as Vi.Mock).mockImplementation(() => fakeOutput);

    const { result } = renderHook(() => useGetCorePool(), {
      accountAddress: fakeAccountAddress,
    });

    expect(result.current).toBe(fakeOutput);
    expect(useGetPool).toHaveBeenCalledWith({
      poolComptrollerAddress: fakeCorePoolComptrollerContractAddress,
      accountAddress: fakeAccountAddress,
    });
  });
});
