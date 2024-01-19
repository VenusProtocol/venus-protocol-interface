import Vi from 'vitest';

import { fakeContractConfigs } from 'packages/contracts/__testUtils__/fakeConfig';
import writeFile from 'utilities/writeFile';

import { generateAbis } from '..';

vi.mock('utilities/writeFile');

describe('generateAbis', () => {
  it('calls writeFile with the right arguments', () => {
    generateAbis({
      outputDirectoryPath: 'fake/output/director/path',
      contractConfigs: fakeContractConfigs,
    });

    expect(writeFile).toHaveBeenCalledTimes(fakeContractConfigs.length);

    fakeContractConfigs.forEach((_fakeContractConfig, index) =>
      expect((writeFile as Vi.Mock).mock.calls[index]).toMatchSnapshot(),
    );
  });
});
