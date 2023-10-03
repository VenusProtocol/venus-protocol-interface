import { renderHook } from '@testing-library/react-hooks';
import { Contract, providers } from 'ethers';
import Vi from 'vitest';

import fakeContractAddress from '__mocks__/models/address';
import { useAuth } from 'context/AuthContext';

import { genericContractGetterHookGenerator } from '..';
import { GenericContractGetter } from '../../genericContractGetterGenerator';

vi.mock('context/AuthContext');

const fakeProvider = new providers.JsonRpcProvider();

const fakeGetter: GenericContractGetter<Contract> = ({ address }) =>
  new Contract(address, [], fakeProvider);

describe('genericContractGetterHookGenerator', () => {
  it('returns a function that calls passed getter and passes it the correct arguments when passing passSigner as false', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      signer: undefined,
      provider: fakeProvider,
    }));

    const { result } = renderHook(() => {
      const hook = genericContractGetterHookGenerator({
        getter: fakeGetter,
      });

      return hook({ address: fakeContractAddress });
    });

    expect(result.current).toBeInstanceOf(Contract);
    expect(result.current?.address).toBe(fakeContractAddress);
    expect(result.current?.provider).toBe(fakeProvider);
  });

  it('returns a function that calls passed getter and passes it the correct arguments when passing passSigner as true and signer exists', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      signer: fakeProvider,
      provider: undefined,
    }));

    const { result } = renderHook(() => {
      const hook = genericContractGetterHookGenerator({
        getter: fakeGetter,
      });

      return hook({ address: fakeContractAddress, passSigner: true });
    });

    expect(result.current).toBeInstanceOf(Contract);
    expect(result.current?.address).toBe(fakeContractAddress);
    expect(result.current?.provider).toBe(fakeProvider);
  });

  it('returns a function that calls passed getter and passes it the correct arguments when passing passSigner as true and signer does not exist', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      signer: undefined,
      provider: fakeProvider,
    }));

    const { result } = renderHook(() => {
      const hook = genericContractGetterHookGenerator({
        getter: fakeGetter,
      });

      return hook({ address: fakeContractAddress, passSigner: true });
    });

    expect(result.current).toBeUndefined();
  });
});
