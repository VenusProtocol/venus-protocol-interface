import { Contract, providers } from 'ethers';
import { ChainId } from 'types';
import Vi from 'vitest';

import fakeContractAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { useAuth } from 'context/AuthContext';
import {
  GetTokenContractInput,
  getTokenContract,
} from 'packages/contracts/utilities/getTokenContract';
import { renderHook } from 'testUtils/render';

import { useGetTokenContract } from '..';

vi.mock('context/AuthContext');
vi.mock('packages/contracts/utilities/getTokenContract');

const fakeProvider = new providers.JsonRpcProvider();

describe('useGetTokenContract', () => {
  beforeEach(() => {
    (getTokenContract as Vi.Mock).mockImplementation(
      ({ signerOrProvider }: GetTokenContractInput) =>
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
      useGetTokenContract({
        token: xvs,
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
      useGetTokenContract({
        token: xvs,
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
      useGetTokenContract({
        token: xvs,
        passSigner: true,
      }),
    );

    expect(result.current).toBeUndefined();
  });
});
