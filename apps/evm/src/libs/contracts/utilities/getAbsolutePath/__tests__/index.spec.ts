import type { Mock } from 'vitest';

import cwd from 'utilities/cwd';

import { getAbsolutePath } from '..';

vi.mock('utilities/cwd');

describe('getAbsolutePath', () => {
  beforeEach(() => {
    (cwd as Mock).mockImplementation(() => './fake/cwd');
  });

  it('returns Contract instance', () => {
    const result = getAbsolutePath({
      relativePath: 'fake/relative/path',
    });

    expect(result).toMatchInlineSnapshot('"fake/cwd/src/libs/contracts/fake/relative/path"');
  });
});
