import type { Mock } from 'vitest';

import { fakeContractConfigs } from 'libs/contracts/__testUtils__/fakeConfig';
import writeFile from 'utilities/writeFile';

import { generateAbis } from '..';

vi.mock('utilities/writeFile');

describe('generateAbis', () => {
  it('calls writeFile with the right arguments', () => {
    generateAbis({
      outputDirectoryPath: 'fake/output/director/path',
      contractConfigs: fakeContractConfigs,
    });

    expect(writeFile).toHaveBeenCalledTimes(fakeContractConfigs.length * 2 + 1); // Twice per contract config + once to generate index file
    expect((writeFile as Mock).mock.calls).toMatchSnapshot();
  });
});
