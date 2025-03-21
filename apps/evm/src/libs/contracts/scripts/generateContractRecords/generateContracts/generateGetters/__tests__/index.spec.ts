import type { Mock } from 'vitest';

import { fakeContractConfigs } from 'libs/contracts/__testUtils__/fakeConfig';
import writeFile from 'utilities/writeFile';

import { generateGetters } from '..';

vi.mock('utilities/writeFile');

describe('generateGetters', () => {
  it('calls writeFile with the right arguments', () => {
    generateGetters({
      outputDirectoryPath: 'fake/output/director/path',
      contractConfigs: fakeContractConfigs,
    });

    expect(writeFile).toHaveBeenCalledTimes(fakeContractConfigs.length + 1);

    for (let s = 0; s < fakeContractConfigs.length + 1; s++) {
      expect((writeFile as Mock).mock.calls[s]).toMatchSnapshot();
    }
  });
});
