import { renderHook } from '@testing-library/react-hooks';
import { Contract, providers } from 'ethers';
import { ChainId } from 'types';
import Vi from 'vitest';

import fakeContractAddress, {
  altAddress as fakeComptrollerContractAddress,
} from '__mocks__/models/address';
import { useAuth } from 'context/AuthContext';

import swapRouterContractGetterHookGenerator from '..';
import { SwapRouterContractGetter } from '../../swapRouterContractGetterGenerator';

vi.mock('context/AuthContext');

const fakeProvider = new providers.JsonRpcProvider();

const fakeGetter: SwapRouterContractGetter<Contract> = () =>
  new Contract(fakeContractAddress, [], fakeProvider);

describe('ya', () => {
  it('returns a function that calls passed getter and passes it the correct arguments when passing passSigner as false', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      signer: undefined,
      provider: fakeProvider,
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() => {
      const hook = swapRouterContractGetterHookGenerator({
        getter: fakeGetter,
      });

      return hook({ comptrollerContractAddress: fakeComptrollerContractAddress });
    });

    expect(result.current).toBeInstanceOf(Contract);
    expect(result.current?.address).toBe(fakeContractAddress);
    expect(result.current?.provider).toBe(fakeProvider);
  });

  it('returns a function that calls passed getter and passes it the correct arguments when passing passSigner as true and signer exists', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      signer: fakeProvider,
      provider: undefined,
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() => {
      const hook = swapRouterContractGetterHookGenerator({
        getter: fakeGetter,
      });

      return hook({ comptrollerContractAddress: fakeComptrollerContractAddress, passSigner: true });
    });

    expect(result.current).toBeInstanceOf(Contract);
    expect(result.current?.address).toBe(fakeContractAddress);
    expect(result.current?.provider).toBe(fakeProvider);
  });

  it('returns a function that calls passed getter and passes it the correct arguments when passing passSigner as true and signer exists', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      signer: undefined,
      provider: fakeProvider,
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() => {
      const hook = swapRouterContractGetterHookGenerator({
        getter: fakeGetter,
      });

      return hook({ comptrollerContractAddress: fakeComptrollerContractAddress, passSigner: true });
    });

    expect(result.current).toBeUndefined();
  });
});
