import type { Mock } from 'vitest';

import { del, list } from '@vercel/blob';
import { removeOutdatedImages } from '..';

vi.mock('@vercel/blob', () => ({
  del: vi.fn(),
  list: vi.fn(),
}));

const makeBlobs = (version: string, files = ['tokens/a.svg', 'tokens/b.svg']) =>
  files.map(f => ({
    url: `https://cdn.example.com/${version}/${f}`,
    pathname: `${version}/${f}`,
  }));

const mockList = (versions: string[]) => {
  const blobs = versions.flatMap(v => makeBlobs(v));
  (list as Mock).mockResolvedValue({ blobs, hasMore: false, cursor: undefined });
};

describe('removeOutdatedImages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not delete anything when there are fewer than 10 versions', async () => {
    mockList(['0.1.0', '0.2.0', '0.3.0']);

    await removeOutdatedImages();

    expect(del).not.toHaveBeenCalled();
  });

  it('does not delete anything when there are exactly 10 versions', async () => {
    mockList([
      '0.1.0',
      '0.2.0',
      '0.3.0',
      '0.4.0',
      '0.5.0',
      '0.6.0',
      '0.7.0',
      '0.8.0',
      '0.9.0',
      '0.10.0',
    ]);

    await removeOutdatedImages();

    expect(del).not.toHaveBeenCalled();
  });

  it('deletes the oldest version when there are 11 versions', async () => {
    mockList([
      '0.1.0',
      '0.2.0',
      '0.3.0',
      '0.4.0',
      '0.5.0',
      '0.6.0',
      '0.7.0',
      '0.8.0',
      '0.9.0',
      '0.10.0',
      '0.11.0',
    ]);

    await removeOutdatedImages();

    const deletedUrls: string[] = (del as Mock).mock.calls[0][0];
    expect(deletedUrls).toEqual(makeBlobs('0.1.0').map(b => b.url));
  });

  it('deletes multiple old versions when far above the limit', async () => {
    mockList([
      '0.1.0',
      '0.2.0',
      '0.3.0',
      '0.4.0',
      '0.5.0',
      '0.6.0',
      '0.7.0',
      '0.8.0',
      '0.9.0',
      '0.10.0',
      '0.11.0',
      '0.12.0',
    ]);

    await removeOutdatedImages();

    const deletedUrls: string[] = (del as Mock).mock.calls[0][0];
    const deletedVersions = [
      ...new Set(deletedUrls.map(url => url.split('/').slice(3, 4).join('/'))),
    ];
    expect(deletedVersions.sort()).toEqual(['0.1.0', '0.2.0']);
  });

  it('compares versions numerically, not lexicographically', async () => {
    // Lexicographic sort would put 0.9.0 after 0.10.0, numeric sort correctly keeps 0.9.0 older
    mockList([
      '0.1.0',
      '0.2.0',
      '0.3.0',
      '0.4.0',
      '0.5.0',
      '0.6.0',
      '0.7.0',
      '0.8.0',
      '0.9.0',
      '0.10.0',
      '0.11.0',
    ]);

    await removeOutdatedImages();

    const deletedUrls: string[] = (del as Mock).mock.calls[0][0];
    expect(deletedUrls).toEqual(makeBlobs('0.1.0').map(b => b.url));
    expect(deletedUrls).not.toEqual(expect.arrayContaining(makeBlobs('0.10.0').map(b => b.url)));
  });

  it('handles paginated list responses', async () => {
    const page1Blobs = makeBlobs('0.1.0');
    const page2Blobs = [
      ...makeBlobs('0.2.0'),
      ...makeBlobs('0.3.0'),
      ...makeBlobs('0.4.0'),
      ...makeBlobs('0.5.0'),
      ...makeBlobs('0.6.0'),
      ...makeBlobs('0.7.0'),
      ...makeBlobs('0.8.0'),
      ...makeBlobs('0.9.0'),
      ...makeBlobs('0.10.0'),
      ...makeBlobs('0.11.0'),
    ];

    (list as Mock)
      .mockResolvedValueOnce({ blobs: page1Blobs, hasMore: true, cursor: 'cursor-1' })
      .mockResolvedValueOnce({ blobs: page2Blobs, hasMore: false, cursor: undefined });

    await removeOutdatedImages();

    expect(list).toHaveBeenCalledTimes(2);
    expect(list).toHaveBeenNthCalledWith(2, { cursor: 'cursor-1' });

    const deletedUrls: string[] = (del as Mock).mock.calls[0][0];
    expect(deletedUrls).toEqual(page1Blobs.map(b => b.url));
  });

  it('ignores blobs whose pathname prefix is not a valid semver string', async () => {
    const blobs = [
      ...makeBlobs('0.1.0'),
      ...makeBlobs('0.2.0'),
      ...makeBlobs('0.3.0'),
      ...makeBlobs('0.4.0'),
      ...makeBlobs('0.5.0'),
      ...makeBlobs('0.6.0'),
      ...makeBlobs('0.7.0'),
      ...makeBlobs('0.8.0'),
      ...makeBlobs('0.9.0'),
      ...makeBlobs('0.10.0'),
      ...makeBlobs('0.11.0'),
      // Non-semver blobs should not be treated as versions
      { url: 'https://cdn.example.com/misc/logo.png', pathname: 'misc/logo.png' },
    ];

    (list as Mock).mockResolvedValue({ blobs, hasMore: false, cursor: undefined });

    await removeOutdatedImages();

    const deletedUrls: string[] = (del as Mock).mock.calls[0][0];
    expect(deletedUrls).toEqual(makeBlobs('0.1.0').map(b => b.url));
    expect(deletedUrls).not.toContain('https://cdn.example.com/misc/logo.png');
  });
});
