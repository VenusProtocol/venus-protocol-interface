import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { xvsTokenOmnichainAbi } from 'libs/contracts';

import { getXvsBridgeMintStatus } from '..';

describe('getXvsBridgeMintStatus', () => {
  test('returns the mint status on success', async () => {
    const fakeMinterToCapMantissa = 5000n;
    const fakeMinterToMintedAmountMantissa = 1000n;

    // Mock the publicClient.readContract method
    const readContractMock = vi.fn().mockImplementation(({ functionName }) => {
      if (functionName === 'minterToCap') {
        return Promise.resolve(fakeMinterToCapMantissa);
      }
      if (functionName === 'minterToMintedAmount') {
        return Promise.resolve(fakeMinterToMintedAmountMantissa);
      }
      return Promise.reject(new Error(`Unexpected function: ${functionName}`));
    });

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsBridgeMintStatus({
      chainXvsProxyOftDestContractAddress: fakeAddress,
      xvsTokenOmnichainContractAddress: fakeAddress,
      publicClient: fakePublicClient,
    });

    expect(readContractMock).toHaveBeenCalledTimes(2);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: xvsTokenOmnichainAbi,
      functionName: 'minterToCap',
      args: [fakeAddress],
    });
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: xvsTokenOmnichainAbi,
      functionName: 'minterToMintedAmount',
      args: [fakeAddress],
    });
    expect(response).toEqual({
      minterToCapMantissa: new BigNumber(fakeMinterToCapMantissa.toString()),
      bridgeAmountMintedMantissa: new BigNumber(fakeMinterToMintedAmountMantissa.toString()),
    });
  });
});
