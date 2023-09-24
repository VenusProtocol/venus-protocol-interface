import Vi from 'vitest';

import cwd from 'utilities/cwd';

import getAbsolutePath from '..';

vi.mock('utilities/cwd');

describe('packages/contracts/utilities/getAbsolutePath', () => {
  beforeEach(() => {
    (cwd as Vi.Mock).mockImplementation(() => './fake/cwd');
  });

  it('returns Contract instance', () => {
    const result = getAbsolutePath({
      relativePath: 'fake/relative/path',
    });

    expect(result).toMatchInlineSnapshot('"fake/cwd/src/packages/contractsNew/fake/relative/path"');
  });
});
