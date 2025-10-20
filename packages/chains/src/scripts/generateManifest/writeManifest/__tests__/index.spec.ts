import { readdirSync } from 'node:fs';
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';

import { IMAGES_DIR_NAME, IMAGES_DIR_PATH } from '../../../../constants';
import { writeFile } from '../../../../utilities/writeFile';

vi.mock('../../../../utilities/writeFile', () => ({
  writeFile: vi.fn(),
}));

vi.mock('../../../../utilities/getImgCdnPath', () => ({
  getImgCdnPath: vi.fn(({ filePath }: { filePath: string }) => `cdn/${filePath}`),
}));

vi.mock('node:fs', async () => {
  const actual = await vi.importActual('node:fs');

  return {
    ...actual,
    readdirSync: vi.fn(),
  };
});

describe('writeManifest', () => {
  const originalEnv = process.env.IMG_CDN_URL;

  beforeEach(() => {
    (writeFile as Mock).mockReset();
    vi.resetModules();
  });

  afterEach(() => {
    process.env.IMG_CDN_URL = originalEnv;
  });

  it('writes a CDN-based manifest when IMG_CDN_URL is defined', async () => {
    process.env.IMG_CDN_URL = 'cdn-base';
    (readdirSync as Mock).mockReturnValue(['token-a.svg']);

    const { writeManifest } = await import('../index');

    writeManifest({ dirPath: 'tokens', outputFileName: 'tokenIcons.ts' });

    expect(readdirSync).toHaveBeenCalledWith(`${IMAGES_DIR_PATH}/tokens`);
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith({
      content: expect.stringContaining("token-a: 'cdn-base/cdn/tokens/token-a.svg'"),
      outputPath: 'src/generated/manifests/tokenIcons.ts',
    });
    expect((writeFile as unknown as Mock).mock.calls[0][0].content).not.toContain('import token-a');
  });

  it('writes a manifest with local imports when IMG_CDN_URL is not defined', async () => {
    // biome-ignore lint:performance/noDelete
    delete process.env.IMG_CDN_URL;
    (readdirSync as Mock).mockReturnValue(['token-b.svg']);

    const { writeManifest } = await import('../index');

    writeManifest({ dirPath: 'tokens', outputFileName: 'tokenIcons.ts' });

    expect(readdirSync).toHaveBeenCalledWith(`${IMAGES_DIR_PATH}/tokens`);
    expect(writeFile).toHaveBeenCalledWith({
      content: expect.stringContaining(
        `import token-b from '../../${IMAGES_DIR_NAME}/tokens/token-b.svg';`,
      ),
      outputPath: 'src/generated/manifests/tokenIcons.ts',
    });
    expect((writeFile as unknown as Mock).mock.calls[0][0].content).toContain('token-b: token-b');
  });
});
