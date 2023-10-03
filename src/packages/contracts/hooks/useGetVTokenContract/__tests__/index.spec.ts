import { renderHook } from '@testing-library/react-hooks';
import { Contract, providers } from 'ethers';
import { ChainId } from 'types';
import Vi from 'vitest';

import fakeContractAddress from '__mocks__/models/address';
import { vXvs } from '__mocks__/models/vTokens';
import { useAuth } from 'context/AuthContext';
import {
  GetVTokenContractInput,
  getVTokenContract,
} from 'packages/contracts/utilities/getVTokenContract';

import { useGetVTokenContract } from '..';

vi.mock('context/AuthContext');
vi.mock('packages/contracts/utilities/getVTokenContract');

const fakeProvider = new providers.JsonRpcProvider();

describe('useGetVTokenContract', () => {
  beforeEach(() => {
    (getVTokenContract as Vi.Mock).mockImplementation(
      ({ signerOrProvider }: GetVTokenContractInput) =>
        new Contract(fakeContractAddress, [], signerOrProvider),
    );
  });

  it('returns a contract with the the correct settings when passing passSigner as false', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      signer: undefined,
      provider: fakeProvider,
      chainId: ChainId.BSC_TESTNET,
    }));

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
    (useAuth as Vi.Mock).mockImplementation(() => ({
      signer: fakeProvider,
      provider: undefined,
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() =>
      useGetVTokenContract({
        vToken: vXvs,
        passSigner: true,
      }),
    );

    expect(result.current).toBeInstanceOf(Contract);
    expect(result.current?.address).toBe(fakeContractAddress);
    expect(result.current?.provider).toBe(fakeProvider);
  });

  it('returns undefined when passing passSigner as true and signer doe not exist', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      signer: undefined,
      provider: fakeProvider,
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() =>
      useGetVTokenContract({
        vToken: vXvs,
        passSigner: true,
      }),
    );

    expect(result.current).toBeUndefined();
  });
});
