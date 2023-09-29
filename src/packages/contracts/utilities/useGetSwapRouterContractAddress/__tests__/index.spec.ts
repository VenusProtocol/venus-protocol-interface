import { renderHook } from '@testing-library/react-hooks';
import { ChainId } from 'types';
import Vi from 'vitest';

import fakeContractAddress, {
  altAddress as fakeComptrollerContractAddress,
} from '__mocks__/models/address';
import { useAuth } from 'context/AuthContext';
import { getSwapRouterContractAddress } from 'packages/contracts/utilities/getSwapRouterContractAddress';

import { useGetSwapRouterContractAddress } from '..';

vi.mock('context/AuthContext');
vi.mock('packages/contracts/utilities/getSwapRouterContractAddress');

describe('useGetSwapRouterContractAddress', () => {
  it('returns a function that calls passed getter and passes it the correct arguments when passing passSigner as false', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));
    (getSwapRouterContractAddress as Vi.Mock).mockImplementation(() => fakeContractAddress);

    const { result } = renderHook(() =>
      useGetSwapRouterContractAddress({
        comptrollerContractAddress: fakeComptrollerContractAddress,
      }),
    );

    expect(result.current).toBe(fakeContractAddress);
  });
});
