import fakeLegacyPoolComptrollerContractResponses from '__mocks__/contracts/legacyPoolComptroller';
import fakePoolLensContractResponses from '__mocks__/contracts/poolLens';
import fakeVenusLensContractResponses from '__mocks__/contracts/venusLens';
import fakePoolRegistryContractAddress, {
  altAddress as fakeVenusLensContractAddress,
} from '__mocks__/models/address';
import tokens from '__mocks__/models/tokens';
import type { PublicClient } from 'viem';
import { vi } from 'vitest';

import { legacyPoolComptrollerAbi, poolLensAbi, venusLensAbi } from 'libs/contracts';
import { ChainId } from 'types';
import { areAddressesEqual } from 'utilities';
import { getVTokens } from '..';

// Mock addresses
const fakePoolLensContractAddress = fakePoolRegistryContractAddress;
const fakeLegacyPoolComptrollerContractAddress = '0x1';

// Mock public client
const fakePublicClient = {
  readContract: vi.fn(async ({ address, functionName }) => {
    if (areAddressesEqual(address, fakePoolLensContractAddress) && functionName === 'getAllPools') {
      return fakePoolLensContractResponses.getAllPools;
    }

    if (
      areAddressesEqual(address, fakeLegacyPoolComptrollerContractAddress) &&
      functionName === 'getAllMarkets'
    ) {
      return fakeLegacyPoolComptrollerContractResponses.getAllMarkets;
    }

    throw new Error('Unexpected readContract call');
  }),
  simulateContract: vi.fn(async ({ address, functionName }) => {
    if (
      areAddressesEqual(address, fakeVenusLensContractAddress) &&
      functionName === 'vTokenMetadataAll'
    ) {
      return { result: fakeVenusLensContractResponses.vTokenMetadataAll };
    }

    throw new Error('Unexpected simulateContract call');
  }),
} as unknown as PublicClient;

describe('getVTokens', () => {
  it('returns the vTokens on success', async () => {
    const response = await getVTokens({
      publicClient: fakePublicClient,
      chainId: ChainId.BSC_TESTNET,
      tokens,
      venusLensContractAddress: fakeVenusLensContractAddress,
      legacyPoolComptrollerContractAddress: fakeLegacyPoolComptrollerContractAddress,
      poolLensContractAddress: fakePoolLensContractAddress,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
    });

    expect(response).toMatchSnapshot();

    expect(fakePublicClient.readContract).toHaveBeenCalledWith({
      abi: poolLensAbi,
      address: fakePoolLensContractAddress,
      functionName: 'getAllPools',
      args: [fakePoolRegistryContractAddress],
    });

    expect(fakePublicClient.readContract).toHaveBeenCalledWith({
      abi: legacyPoolComptrollerAbi,
      address: fakeLegacyPoolComptrollerContractAddress,
      functionName: 'getAllMarkets',
    });

    expect(fakePublicClient.simulateContract).toHaveBeenCalledWith({
      abi: venusLensAbi,
      address: fakeVenusLensContractAddress,
      functionName: 'vTokenMetadataAll',
      args: [fakeLegacyPoolComptrollerContractResponses.getAllMarkets],
    });
  });

  it('still functions without passing venusLensContract or legacyPoolComptrollerContract', async () => {
    const response = await getVTokens({
      publicClient: fakePublicClient,
      chainId: ChainId.BSC_TESTNET,
      tokens,
      poolLensContractAddress: fakePoolLensContractAddress,
      poolRegistryContractAddress: fakePoolRegistryContractAddress,
    });

    expect(response).toMatchSnapshot();

    // Check contracts were called correctly (only poolLens should be called)
    expect(fakePublicClient.readContract).toHaveBeenCalledTimes(1); // Only poolLens
    expect(fakePublicClient.readContract).toHaveBeenCalledWith({
      abi: poolLensAbi,
      address: fakePoolLensContractAddress,
      functionName: 'getAllPools',
      args: [fakePoolRegistryContractAddress],
    });
    expect(fakePublicClient.simulateContract).not.toHaveBeenCalled();
  });
});
