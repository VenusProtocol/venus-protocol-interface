import type { Address } from 'viem';
import { describe, expect, it, vi } from 'vitest';

import { ChainId } from '../../../../types';
import { writeVTokens } from '../index';
import { vBep20Abi } from '../vBep20Abi';

const { writeFileMock, multicallMock, createPublicClientMock } = vi.hoisted(() => {
  const writeFileMock = vi.fn();
  const multicallMock = vi.fn();
  const createPublicClientMock = vi.fn(() => ({
    multicall: multicallMock,
  }));

  return { writeFileMock, multicallMock, createPublicClientMock };
});

vi.mock('../../../../utilities/writeFile', () => ({
  writeFile: writeFileMock,
}));

vi.mock('../../../../utilities/createPublicClient', () => ({
  createPublicClient: createPublicClientMock,
}));

vi.mock('../../../../tokens/underlyingTokens', () => ({
  tokens: {
    56: [
      {
        address: '0xunderlying' as Address,
        symbol: 'WBTC',
        decimals: 8,
        iconSrc: 'icon.svg',
      },
    ],
  },
}));

describe('writeVTokens', () => {
  it('fetches data for each vToken and writes the generated file', async () => {
    const vTokenAddress = '0x1234' as Address;

    multicallMock.mockResolvedValue([{ result: 'vWBTC' }, { result: '0xunderlying' }]);

    await writeVTokens({
      vTokenAddresses: [vTokenAddress],
      chainId: ChainId.BSC_MAINNET,
      outputFileName: 'bscMainnet',
    });

    expect(createPublicClientMock).toHaveBeenCalledWith({ chainId: ChainId.BSC_MAINNET });
    expect(multicallMock).toHaveBeenCalledWith({
      contracts: [
        {
          address: vTokenAddress,
          abi: vBep20Abi,
          functionName: 'symbol',
        },
        {
          address: vTokenAddress,
          abi: vBep20Abi,
          functionName: 'underlying',
        },
      ],
    });

    expect(writeFileMock).toHaveBeenCalledWith({
      content: expect.any(String),
      outputPath: 'src/generated/vTokens/bscMainnet.ts',
    });

    expect(writeFileMock.mock.calls[0][0].content).toMatchSnapshot();
  });
});
