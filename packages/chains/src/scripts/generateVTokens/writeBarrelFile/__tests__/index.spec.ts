import { beforeEach, describe, expect, it, vi } from 'vitest';

const { writeFileMock } = vi.hoisted(() => ({
  writeFileMock: vi.fn(),
}));

vi.mock('../../../../utilities/writeFile', () => ({
  writeFile: writeFileMock,
}));

import { ChainId } from '../../../../types';
import type { TokenFile } from '../../types';
import { writeBarrelFile } from '../index';

describe('writeBarrelFile', () => {
  beforeEach(() => {
    writeFileMock.mockReset();
  });

  it('writes the barrel file with the provided token files', () => {
    const tokenFiles: TokenFile[] = [
      {
        chainId: ChainId.BSC_MAINNET,
        tokenFileName: 'bscMainnet',
        vTokenAddresses: [],
      },
      {
        chainId: ChainId.ETHEREUM,
        tokenFileName: 'ethereum',
        vTokenAddresses: [],
      },
    ];

    writeBarrelFile({ tokenFiles });

    expect(writeFileMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock.mock.calls[0][0].content).toMatchSnapshot();
    expect(writeFileMock).toHaveBeenCalledWith({
      content: expect.any(String),
      outputPath: 'src/generated/vTokens/index.ts',
    });
  });
});
