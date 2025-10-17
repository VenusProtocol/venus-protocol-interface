import type { Address } from 'viem';
import { describe, expect, it, vi } from 'vitest';

import { ChainId } from '../../../../types';
import type { PoolConfig } from '../../types';
import { getVTokenAddresses } from '../index';
import { abi as poolLensAbi } from '../poolLensAbi';
import { abi as venusLensAbi } from '../venusLensAbi';

const { multicallMock, createPublicClientMock } = vi.hoisted(() => {
  const multicallMock = vi.fn();
  const createPublicClientMock = vi.fn(() => ({
    multicall: multicallMock,
  }));

  return { multicallMock, createPublicClientMock };
});

vi.mock('../../../../utilities/createPublicClient', () => ({
  createPublicClient: createPublicClientMock,
}));

describe('getVTokenAddresses', () => {
  it('retrieves vToken addresses from both legacy and isolated pool configs', async () => {
    const poolConfig: PoolConfig = {
      chainId: ChainId.BSC_MAINNET,
      tokenFileName: 'bscMainnet',
      configs: [
        {
          venusLensContractAddress: '0x1' as Address,
          unitrollerContractAddress: '0x2' as Address,
        },
        {
          poolLensContractAddress: '0x3' as Address,
          poolRegistryContractAddress: '0x4' as Address,
        },
      ],
    };

    multicallMock.mockResolvedValue([
      [
        {
          markets: [
            { isListed: true, vToken: '0xAAA' as Address },
            { isListed: false, vToken: '0xBBB' as Address },
          ],
        },
      ],
      [
        {
          vTokens: [
            { isListed: true, vToken: '0xCCC' as Address },
            { isListed: true, vToken: '0xDDD' as Address },
          ],
        },
      ],
    ]);

    const { vTokenAddresses } = await getVTokenAddresses({ poolConfig });

    expect(createPublicClientMock).toHaveBeenCalledWith({ chainId: ChainId.BSC_MAINNET });
    expect(multicallMock).toHaveBeenCalledWith({
      contracts: [
        {
          address: '0x1',
          abi: venusLensAbi,
          functionName: 'getAllPoolsData',
          args: ['0x2'],
        },
        {
          address: '0x3',
          abi: poolLensAbi,
          functionName: 'getAllPools',
          args: ['0x4'],
        },
      ],
      allowFailure: false,
    });

    expect(vTokenAddresses).toEqual(['0xAAA', '0xCCC', '0xDDD']);
  });
});
