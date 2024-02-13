import { Contract } from 'ethers';
import {
  GetVTokenContractInput,
  getVTokenContract,
} from 'libs/contracts/utilities/getVTokenContract';
import { useProvider, useSigner } from 'libs/wallet';
import Vi from 'vitest';

import fakeContractAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import fakeSigner from '__mocks__/models/signer';
import { vXvs } from '__mocks__/models/vTokens';
import { renderHook } from 'testUtils/render';

import { useGetVTokenContract } from '..';

vi.mock('libs/contracts/utilities/getVTokenContract');

describe('useGetVTokenContract', () => {
  beforeEach(() => {
    (getVTokenContract as Vi.Mock).mockImplementation(
      ({ signerOrProvider }: GetVTokenContractInput) =>
        new Contract(fakeContractAddress, [], signerOrProvider),
    );

    (useProvider as Vi.Mock).mockImplementation(() => ({
      provider: fakeProvider,
    }));
  });

  it('returns a contract with the the correct settings when passing passSigner as false', () => {
    const { result } = renderHook(() =>
      useGetVTokenContract({
        vToken: vXvs,
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
      useGetVTokenContract({
        vToken: vXvs,
        passSigner: true,
      }),
    );

    expect(result.current).toBeInstanceOf(Contract);
    expect(result.current?.address).toBe(fakeContractAddress);
    expect(result.current?.signer).toBe(fakeSigner);
  });

  it('returns undefined when passing passSigner as true and signer doe not exist', () => {
    const { result } = renderHook(() =>
      useGetVTokenContract({
        vToken: vXvs,
        passSigner: true,
      }),
    );

    expect(result.current).toBeUndefined();
  });
});
