import { renderHook } from '@testing-library/react-hooks';
import { Contract, providers } from 'ethers';
import { ChainId } from 'types';
import Vi from 'vitest';

import fakeContractAddress from '__mocks__/models/address';
import { useAuth } from 'context/AuthContext';

import { uniqueContractGetterHookGenerator } from '..';
import { UniqueContractGetter } from '../../uniqueContractGetterGenerator';

vi.mock('context/AuthContext');

const fakeProvider = new providers.JsonRpcProvider();

const fakeGetter: UniqueContractGetter<Contract> = () =>
  new Contract(fakeContractAddress, [], fakeProvider);

describe('uniqueContractGetterHookGenerator', () => {
  it('returns a function that calls passed getter and passes it the correct arguments when passing passSigner as false', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      signer: undefined,
      provider: fakeProvider,
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() => {
      const hook = uniqueContractGetterHookGenerator({
        getter: fakeGetter,
      });

      return hook();
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
      const hook = uniqueContractGetterHookGenerator({
        getter: fakeGetter,
      });

      return hook({ passSigner: true });
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
      const hook = uniqueContractGetterHookGenerator({
        getter: fakeGetter,
      });

      return hook({ passSigner: true });
    });

    expect(result.current).toBeUndefined();
  });
});
