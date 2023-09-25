import fakeContractConfigs from 'packages/contractsNew/__testUtils__/fakeConfig';
import Vi from 'vitest';

import writeFile from 'utilities/writeFile';

import generateGetters from '..';

vi.mock('utilities/writeFile');

describe('generateGetters', () => {
  it('calls writeFile with the right arguments', () => {
    generateGetters({
      outputDirectoryPath: 'fake/output/director/path',
      contractConfigs: fakeContractConfigs,
    });

    expect(writeFile).toHaveBeenCalledTimes(fakeContractConfigs.length + 1);

    for (let s = 0; s < fakeContractConfigs.length + 1; s++) {
      expect((writeFile as Vi.Mock).mock.calls[s]).toMatchSnapshot();
    }
  });
});
