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

    expect(writeFile).toHaveBeenCalledTimes(fakeContractConfigs.length * 2);

    fakeContractConfigs.forEach((_fakeContractConfig, index) =>
      expect((writeFile as Mock).mock.calls[index]).toMatchSnapshot(),
    );
  });
});
