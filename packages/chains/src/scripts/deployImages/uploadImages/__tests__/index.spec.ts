import { type ReadStream, createReadStream, readdirSync } from 'node:fs';
import { type Mock, describe, expect, it, vi } from 'vitest';

import { put } from '@vercel/blob';
import { uploadImages } from '..';
import { IMAGES_DIR_PATH } from '../../../../constants';
import { getImgCdnPath } from '../../../../utilities/getImgCdnPath';

const directories: Record<string, string[]> = {
  [IMAGES_DIR_PATH]: ['tokens', 'logo.png'],
  [`${IMAGES_DIR_PATH}/tokens`]: ['token-a.svg'],
};

vi.mock('@vercel/blob', () => ({
  put: vi.fn(),
}));

vi.mock('node:fs', () => ({
  createReadStream: vi.fn(),
  readdirSync: vi.fn(path => directories[path] ?? []),
  statSync: vi.fn(path => ({
    isDirectory: () => Boolean(directories[path]),
  })),
}));

vi.mock('../../../../utilities/getImgCdnPath', () => ({
  getImgCdnPath: vi.fn(({ filePath }: { filePath: string }) => `cdn/${filePath}`),
}));

describe('uploadImage', () => {
  it('recursively uploads each image to the CDN', async () => {
    const streams = new Map<string, ReadStream>();
    (createReadStream as Mock).mockImplementation(path => {
      const stream = { path } as unknown as ReadStream;
      streams.set(path, stream);
      return stream;
    });

    await uploadImages();

    expect(readdirSync).toHaveBeenCalledWith(IMAGES_DIR_PATH);
    expect(getImgCdnPath).toHaveBeenCalledTimes(2);
    expect(getImgCdnPath).toHaveBeenNthCalledWith(1, {
      filePath: `${IMAGES_DIR_PATH}/tokens/token-a.svg`,
    });
    expect(getImgCdnPath).toHaveBeenNthCalledWith(2, {
      filePath: `${IMAGES_DIR_PATH}/logo.png`,
    });

    expect(put).toHaveBeenCalledTimes(2);
    expect(put).toHaveBeenCalledWith(
      'cdn/src/images/tokens/token-a.svg',
      streams.get(`${IMAGES_DIR_PATH}/tokens/token-a.svg`),
      { access: 'public' },
    );
    expect(put).toHaveBeenCalledWith(
      'cdn/src/images/logo.png',
      streams.get(`${IMAGES_DIR_PATH}/logo.png`),
      { access: 'public' },
    );
  });
});
