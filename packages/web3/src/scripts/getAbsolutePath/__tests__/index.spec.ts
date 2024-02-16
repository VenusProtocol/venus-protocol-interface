import Vi from 'vitest';

import cwd from 'scripts/cwd';

import { getAbsolutePath } from '..';

vi.mock('scripts/cwd');

describe('getAbsolutePath', () => {
  beforeEach(() => {
    (cwd as Vi.Mock).mockImplementation(() => './fake/cwd');
  });

  it('returns Contract instance', () => {
    const result = getAbsolutePath({
      relativePath: 'fake/relative/path',
    });

    expect(result).toMatchInlineSnapshot('"fake/cwd/src/libs/contracts/fake/relative/path"');
  });
});
