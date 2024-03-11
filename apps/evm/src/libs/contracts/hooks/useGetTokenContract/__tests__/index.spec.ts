import { Contract } from 'ethers';
import type Vi from 'vitest';

import fakeContractAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import fakeSigner from '__mocks__/models/signer';
import { xvs } from '__mocks__/models/tokens';
import { renderHook } from 'testUtils/render';

import {
  type GetTokenContractInput,
  getTokenContract,
} from 'libs/contracts/utilities/getTokenContract';
import { useProvider, useSigner } from 'libs/wallet';

import { useGetTokenContract } from '..';

vi.mock('libs/contracts/utilities/getTokenContract');

describe('useGetTokenContract', () => {
  beforeEach(() => {
    (getTokenContract as Vi.Mock).mockImplementation(
      ({ signerOrProvider }: GetTokenContractInput) =>
        new Contract(fakeContractAddress, [], signerOrProvider),
    );

    (useProvider as Vi.Mock).mockImplementation(() => ({
      provider: fakeProvider,
    }));
  });

  it('returns a contract with the the correct settings when passing passSigner as false', () => {
    const { result } = renderHook(() =>
      useGetTokenContract({
        token: xvs,
      }),
    );

    expect(result.current).toBeInstanceOf(Contract);
    expect(result.current?.address).toBe(fakeContractAddress);
    expect(result.current?.provider).toBe(fakeProvider);
  });

  it('returns a contract with the the correct settings passSigner as true and signer exists', () => {
    (useSigner as Vi.Mock).mockImplementation(() => ({
      signer: fakeSigner,
    }));

    const { result } = renderHook(() =>
      useGetTokenContract({
        token: xvs,
        passSigner: true,
      }),
    );

    expect(result.current).toBeInstanceOf(Contract);
    expect(result.current?.address).toBe(fakeContractAddress);
    expect(result.current?.signer).toBe(fakeSigner);
  });

  it('returns undefined when passing passSigner as true and signer doe not exist', () => {
    const { result } = renderHook(() =>
      useGetTokenContract({
        token: xvs,
        passSigner: true,
      }),
    );

    expect(result.current).toBeUndefined();
  });
});
