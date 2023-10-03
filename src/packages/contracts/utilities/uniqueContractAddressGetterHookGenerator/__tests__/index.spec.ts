import { renderHook } from '@testing-library/react-hooks';
import { ChainId } from 'types';
import Vi from 'vitest';

import fakeContractAddress from '__mocks__/models/address';
import { useAuth } from 'context/AuthContext';
import { UniqueContractAddressGetter } from 'packages/contracts/utilities/uniqueContractAddressGetterGenerator';

import { uniqueContractAddressGetterHookGenerator } from '..';

vi.mock('context/AuthContext');

const fakeGetter: UniqueContractAddressGetter = () => fakeContractAddress;

describe('uniqueContractAddressGetterHookGenerator', () => {
  it('returns a function that calls passed getter and passes it the correct arguments', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() => {
      const hook = uniqueContractAddressGetterHookGenerator({
        getter: fakeGetter,
      });

      return hook();
    });

    expect(result.current).toBe(fakeContractAddress);
  });
});
