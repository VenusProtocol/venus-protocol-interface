import Vi from 'vitest';

import fakeAccountAddress, {
  altAddress as fakeCorePoolComptrollerContractAddress,
} from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { renderHook } from 'testUtils/render';

import { useGetCorePool } from '..';

vi.mock('context/AuthContext');
vi.mock('hooks/useGetChainMetadata');

describe('useGetCorePool', () => {
  it('returns the correct pool', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      accountAddress: fakeAccountAddress,
    }));

    (useGetChainMetadata as Vi.Mock).mockImplementation(() => ({
      corePoolComptrollerContractAddress: fakeCorePoolComptrollerContractAddress,
    }));

    const fakeOutput = {
      data: {
        pool: poolData[0],
      },
    };
    (useGetPool as Vi.Mock).mockImplementation(() => fakeOutput);

    const { result } = renderHook(() => useGetCorePool());

    expect(result.current).toBe(fakeOutput);
    expect(useGetPool).toHaveBeenCalledWith({
      poolComptrollerAddress: fakeCorePoolComptrollerContractAddress,
      accountAddress: fakeAccountAddress,
    });
  });
});
